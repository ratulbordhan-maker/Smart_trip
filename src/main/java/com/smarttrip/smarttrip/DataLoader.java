package com.smarttrip.smarttrip;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    @SuppressWarnings("unused")
    public CommandLineRunner initializeSampleData(
            UserRepository userRepository,
            TravelPackageRepository travelPackageRepository,
            BookingRepository bookingRepository,
            ReviewRepository reviewRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            var invalidUsers = userRepository.findAll().stream()
                    .filter(u -> u.getEmail() == null || u.getPassword() == null || u.getRole() == null)
                    .toList();
            if (!invalidUsers.isEmpty()) {
                for (User invalidUser : invalidUsers) {
                    var bookings = bookingRepository.findByUserId(invalidUser.getId());
                    bookingRepository.deleteAll(bookings);
                    var reviews = reviewRepository.findByUser(invalidUser);
                    reviewRepository.deleteAll(reviews);
                }
                userRepository.deleteAll(invalidUsers);
            }

            User admin = userRepository.findByEmail("admin@smarttrip.com")
                    .orElseGet(() -> {
                        User user = new User();
                        user.setName("Admin");
                        user.setEmail("admin@smarttrip.com");
                        user.setPassword(passwordEncoder.encode("admin123"));
                        user.setRole("ADMIN");
                        return userRepository.save(user);
                    });

            User agency = userRepository.findByEmail("agency@smarttrip.com")
                    .orElseGet(() -> {
                        User user = new User();
                        user.setName("Happy Travels Agency");
                        user.setEmail("agency@smarttrip.com");
                        user.setPassword(passwordEncoder.encode("agency123"));
                        user.setRole("AGENCY");
                        return userRepository.save(user);
                    });

            User traveler = userRepository.findByEmail("traveler@smarttrip.com")
                    .orElseGet(() -> {
                        User user = new User();
                        user.setName("Jane Doe");
                        user.setEmail("traveler@smarttrip.com");
                        user.setPassword(passwordEncoder.encode("traveler123"));
                        user.setRole("USER");
                        return userRepository.save(user);
                    });

            if (travelPackageRepository.count() == 0) {
                TravelPackage baliPackage = new TravelPackage();
                baliPackage.setTitle("Bali Beach Escape");
                baliPackage.setDescription("7 nights in Bali with seaside villas and guided tours.");
                baliPackage.setDestination("Bali, Indonesia");
                baliPackage.setTravelDate("2026-08-05");
                baliPackage.setPrice(1299.99);
                baliPackage.setCreatedBy(agency.getId());
                baliPackage.setTotalSlots(20);
                baliPackage.setAvailableSlots(14);
                baliPackage.setActive(true);
                baliPackage.setCouponCode("BALI2026");
                baliPackage.setDiscountType("PERCENT");
                baliPackage.setDiscountValue(10.0);
                baliPackage.setCouponExpiry("2026-07-01");

                TravelPackage parisPackage = new TravelPackage();
                parisPackage.setTitle("Paris City Lights");
                parisPackage.setDescription("5 days in Paris with museum passes and Seine dinner cruise.");
                parisPackage.setDestination("Paris, France");
                parisPackage.setTravelDate("2026-09-12");
                parisPackage.setPrice(999.99);
                parisPackage.setCreatedBy(agency.getId());
                parisPackage.setTotalSlots(15);
                parisPackage.setAvailableSlots(8);
                parisPackage.setActive(true);
                parisPackage.setCouponCode("PARISFUN");
                // FIX: was "AMOUNT" but BookingController originally only checked for "FLAT".
                // Now BookingController handles both, but standardise to "FLAT" here for clarity.
                parisPackage.setDiscountType("FLAT");
                parisPackage.setDiscountValue(100.0);
                parisPackage.setCouponExpiry("2026-08-20");

                travelPackageRepository.saveAll(List.of(baliPackage, parisPackage));

                if (reviewRepository.count() == 0) {
                    Review review = new Review();
                    review.setRating(5);
                    review.setComment("Amazing trip! The guides were friendly and the hotel was perfect.");
                    review.setUser(traveler);
                    review.setTravelPackage(baliPackage);
                    reviewRepository.save(review);
                }

                if (bookingRepository.count() == 0) {
                    Booking booking = new Booking();
                    booking.setStatus("CONFIRMED");
                    booking.setUser(traveler);
                    booking.setTravelPackage(baliPackage);
                    booking.setNumberOfTravelers(1);
                    booking.setTotalPrice(1299.99);
                    booking.setFinalPrice(1169.99);
                    bookingRepository.save(booking);
                }
            }
        };
    }
}