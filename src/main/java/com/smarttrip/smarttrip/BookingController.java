package com.smarttrip.smarttrip;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TravelPackageRepository packageRepository;

    // ── Create Booking ────────────────────────────────────
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        if (booking.getUser() == null || booking.getUser().getId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "User is required"));
        }
        User user = userRepository.findById(booking.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (booking.getTravelPackage() == null || booking.getTravelPackage().getId() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Travel package is required"));
        }
        TravelPackage pkg = packageRepository.findById(booking.getTravelPackage().getId())
                .orElseThrow(() -> new RuntimeException("Package not found"));

        // FIX: guard against inactive packages being booked
        if (!pkg.isActive()) {
            return ResponseEntity.badRequest().body(Map.of("error", "This package is no longer available"));
        }

        // FIX: prevent duplicate active bookings for the same package by the same user
        boolean alreadyBooked = bookingRepository
                .findByUserId(user.getId())
                .stream()
                .anyMatch(b ->
                    b.getTravelPackage() != null && b.getTravelPackage().getId().equals(pkg.getId())
                    && !b.getStatus().equals("CANCELLED")
                );
        if (alreadyBooked) {
            return ResponseEntity.badRequest().body(Map.of("error", "You already have an active booking for this package"));
        }

        if (pkg.getAvailableSlots() < booking.getNumberOfTravelers()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Not enough slots available"));
        }

        double basePrice = pkg.getPrice() * booking.getNumberOfTravelers();
        double finalPrice = basePrice;

        if (booking.getCouponCode() != null && !booking.getCouponCode().isBlank()) {
            if (booking.getCouponCode().equalsIgnoreCase(pkg.getCouponCode())) {
                // FIX: DataLoader uses "AMOUNT" for flat discount but BookingController
                // checked for "FLAT" — normalised to support both spellings
                String dtype = pkg.getDiscountType() != null ? pkg.getDiscountType().toUpperCase() : "";
                if (dtype.equals("PERCENT")) {
                    finalPrice = basePrice * (1 - pkg.getDiscountValue() / 100.0);
                } else if (dtype.equals("FLAT") || dtype.equals("AMOUNT")) {
                    finalPrice = Math.max(0, basePrice - pkg.getDiscountValue());
                }
            }
            // Silently ignore invalid/unknown coupon codes — don't error out
        }

        pkg.setAvailableSlots(pkg.getAvailableSlots() - booking.getNumberOfTravelers());
        packageRepository.save(pkg);

        booking.setUser(user);
        booking.setTravelPackage(pkg);
        booking.setStatus("PENDING");
        booking.setTotalPrice(basePrice);
        booking.setFinalPrice(finalPrice);

        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    // ── Get all bookings (admin) ──────────────────────────
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // ── Get bookings for a specific user (traveler) ───────
    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUser(@PathVariable Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    // ── Get bookings for an agency's packages ─────────────
    @GetMapping("/agency/{agencyId}")
    public List<Booking> getBookingsByAgency(@PathVariable Long agencyId) {
        return bookingRepository.findByTravelPackageCreatedBy(agencyId);
    }

    // ── Approve (agency / admin) ──────────────────────────
    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // FIX: guard against approving a non-PENDING booking
        if (!"PENDING".equals(booking.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only PENDING bookings can be approved"));
        }

        booking.setStatus("CONFIRMED");
        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    // ── Reject (agency / admin) ───────────────────────────
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // FIX: guard against rejecting a non-PENDING booking
        if (!"PENDING".equals(booking.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only PENDING bookings can be rejected"));
        }

        // Restore slots
        TravelPackage pkg = booking.getTravelPackage();
        if (pkg != null) {
            pkg.setAvailableSlots(pkg.getAvailableSlots() + booking.getNumberOfTravelers());
            packageRepository.save(pkg);
        }

        booking.setStatus("CANCELLED");
        return ResponseEntity.ok(bookingRepository.save(booking));
    }

    // ── Cancel (traveler) ─────────────────────────────────
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"PENDING".equals(booking.getStatus())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Only PENDING bookings can be cancelled"));
        }

        TravelPackage pkg = booking.getTravelPackage();
        if (pkg != null) {
            pkg.setAvailableSlots(pkg.getAvailableSlots() + booking.getNumberOfTravelers());
            packageRepository.save(pkg);
        }

        booking.setStatus("CANCELLED");
        return ResponseEntity.ok(bookingRepository.save(booking));
    }
}