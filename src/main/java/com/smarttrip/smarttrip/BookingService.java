package com.smarttrip.smarttrip;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

   

    @Autowired
    private TravelPackageRepository packageRepository;

    @Transactional
    public Booking createBooking(Booking booking) {
        Long userId = booking.getUser().getId();
        Long packageId = booking.getTravelPackage().getId();

        // 1. Check for duplicates
        if (bookingRepository.existsByUserIdAndTravelPackageId(userId, packageId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "You have already booked this package!");
        }

        TravelPackage pkg = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found"));

        // 2. ✅ FIX: Lock the price at the moment of booking
        booking.setFinalPrice(pkg.getPrice());
        booking.setStatus("PENDING");

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking approveBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        if (!"PENDING".equals(booking.getStatus())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only PENDING bookings can be approved.");
        }

        TravelPackage pkg = booking.getTravelPackage();

        // 3. Check slots
        if (pkg.getAvailableSlots() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No slots available for this package.");
        }

        // 4. Decrement slot
        pkg.setAvailableSlots(pkg.getAvailableSlots() - 1);
        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking rejectBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        // ✅ FIX: If rejecting a booking that was already CONFIRMED, return the slot
        if ("CONFIRMED".equals(booking.getStatus())) {
            TravelPackage pkg = booking.getTravelPackage();
            pkg.setAvailableSlots(pkg.getAvailableSlots() + 1);
        }

        booking.setStatus("REJECTED");
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking cancelBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        // Return slot if it was confirmed
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
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
    }

    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}