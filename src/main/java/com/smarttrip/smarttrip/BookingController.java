package com.smarttrip.smarttrip;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TravelPackageRepository packageRepository;

    @PostMapping
    public Object createBooking(@RequestBody Booking booking) {
        TravelPackage pkg = packageRepository.findById(booking.getPackageId()).orElse(null);

        if (pkg == null) {
            return "Package not found";
        }

        if (pkg.getAvailability() <= 0) {
            return "No slots available for this package";
        }

        booking.setPackageTitle(pkg.getTitle());
        booking.setTotalAmount(pkg.getPrice() * booking.getNumberOfPeople());
        booking.setStatus("PENDING");
        booking.setBookingDate(LocalDate.now());

        return bookingRepository.save(booking);
    }

    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @GetMapping("/pending")
    public List<Booking> getPendingBookings() {
        return bookingRepository.findByStatus("PENDING");
    }

    @PutMapping("/{id}/accept")
    public Object acceptBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking == null) {
            return "Booking not found";
        }

        TravelPackage pkg = packageRepository.findById(booking.getPackageId()).orElse(null);

        if (pkg == null) {
            return "Package not found";
        }

        if (pkg.getAvailability() < booking.getNumberOfPeople()) {
            return "Not enough available slots";
        }

        booking.setStatus("CONFIRMED");

        pkg.setAvailability(pkg.getAvailability() - booking.getNumberOfPeople());
        packageRepository.save(pkg);

        return bookingRepository.save(booking);
    }

    @PutMapping("/{id}/reject")
    public Object rejectBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking == null) {
            return "Booking not found";
        }

        booking.setStatus("REJECTED");

        // Wallet refund will be connected later with wallet module
        return bookingRepository.save(booking);
    }

    @PutMapping("/{id}/cancel")
    public Object cancelBooking(@PathVariable Long id) {
        Booking booking = bookingRepository.findById(id).orElse(null);

        if (booking == null) {
            return "Booking not found";
        }

        if (booking.getStatus().equals("CONFIRMED")) {
            TravelPackage pkg = packageRepository.findById(booking.getPackageId()).orElse(null);

            if (pkg != null) {
                pkg.setAvailability(pkg.getAvailability() + booking.getNumberOfPeople());
                packageRepository.save(pkg);
            }
        }

        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }
}