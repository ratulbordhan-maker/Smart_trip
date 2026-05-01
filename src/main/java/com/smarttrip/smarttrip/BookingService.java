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

        // 🔴 Prevent duplicate booking
        if (bookingRepository.existsByUserId(booking.getUser().getId())) {
            throw new RuntimeException("User already has a booking!");
        }

        User user = userRepository.findById(booking.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        TravelPackage pkg = packageRepository.findById(booking.getTravelPackage().getId())
                .orElseThrow(() -> new RuntimeException("Package not found"));

        booking.setUser(user);
        booking.setTravelPackage(pkg);

        // ✅ Booking starts as PENDING
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

        // decrease slot ONLY on approval
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

        // restore slot only if already confirmed
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