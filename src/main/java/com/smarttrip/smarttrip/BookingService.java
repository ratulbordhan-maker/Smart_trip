package com.smarttrip.smarttrip;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TravelPackageRepository packageRepository;

    @Transactional
    public Booking createBooking(Booking booking) {

        // ✅ FIX: Previously used existsByUserId() which blocked a user from EVER
        // booking more than one package across their lifetime. Now we check for a
        // duplicate booking on THIS specific package only, and only non-cancelled ones.
        boolean alreadyBooked = bookingRepository
                .findByUserId(booking.getUser().getId())
                .stream()
                .anyMatch(b ->
                    b.getTravelPackage().getId().equals(booking.getTravelPackage().getId())
                    && !b.getStatus().equals("CANCELLED")
                );

        if (alreadyBooked) {
            throw new RuntimeException("User already has an active booking for this package!");
        }

        User user = userRepository.findById(booking.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TravelPackage pkg = packageRepository.findById(booking.getTravelPackage().getId())
                .orElseThrow(() -> new RuntimeException("Package not found"));

        if (!pkg.isActive()) {
            throw new RuntimeException("This package is no longer available");
        }

        booking.setUser(user);
        booking.setTravelPackage(pkg);
        booking.setStatus("PENDING");

        return bookingRepository.save(booking);
    }

    // ✅ APPROVE BOOKING
    @Transactional
    public Booking approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        TravelPackage pkg = booking.getTravelPackage();

        if (pkg.getAvailableSlots() <= 0) {
            throw new RuntimeException("No slots available");
        }

        pkg.setAvailableSlots(pkg.getAvailableSlots() - 1);
        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }

    // ❌ REJECT BOOKING
    @Transactional
    public Booking rejectBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("CANCELLED");

        return bookingRepository.save(booking);
    }

    // 🔁 CANCEL (for users)
    @Transactional
    public Booking cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if ("CONFIRMED".equals(booking.getStatus())) {
            TravelPackage pkg = booking.getTravelPackage();
            pkg.setAvailableSlots(pkg.getAvailableSlots() + 1);
        }

        booking.setStatus("CANCELLED");

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}