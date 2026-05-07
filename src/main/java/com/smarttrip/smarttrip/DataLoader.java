package com.smarttrip.smarttrip;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.time.LocalDate;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner initializeSampleData(
            UserRepository userRepository,
            TravelPackageRepository travelPackageRepository,
            BookingRepository bookingRepository,
            ReviewRepository reviewRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {
            System.out.println("🛠️  Initializing Sample Data...");

            // ✅ 1. Clean invalid data safely (Good for re-runs)
            var invalidUsers = userRepository.findAll().stream()
                    .filter(u -> u.getEmail() == null || u.getPassword() == null || u.getRole() == null)
                    .toList();

            for (User invalidUser : invalidUsers) {
                bookingRepository.deleteByUserId(invalidUser.getId());
                reviewRepository.deleteByUserId(invalidUser.getId());
            }
            userRepository.deleteAll(invalidUsers);

            // ✅ 2. Create Default Users (Admin, Agency, Traveler)
            userRepository.findByEmail("admin@smarttrip.com").orElseGet(() -> {
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

            // ✅ 3. Create Travel Packages
            if (travelPackageRepository.count() == 0) {
                TravelPackage bali = new TravelPackage();
                bali.setTitle("Bali Beach Escape");
                bali.setDescription("7 nights in Bali with seaside villas.");
                bali.setDestination("Bali");
                bali.setTravelDate(LocalDate.parse("2026-08-05"));
                bali.setPrice(1299.99);
                bali.setCreatedBy(agency.getId());
                bali.setTotalSlots(20);
                bali.setAvailableSlots(14);
                bali.setActive(true);

                TravelPackage paris = new TravelPackage();
                paris.setTitle("Paris City Lights");
                paris.setDescription("5 days in Paris.");
                paris.setDestination("Paris");
                paris.setTravelDate(LocalDate.parse("2026-08-05"));
                paris.setPrice(999.99);
                paris.setCreatedBy(agency.getId());
                paris.setTotalSlots(15);
                paris.setAvailableSlots(8);
                paris.setActive(true);

                travelPackageRepository.saveAll(List.of(bali, paris));

                // ✅ 4. Create Sample Review
                if (reviewRepository.count() == 0) {
                    Review review = new Review();
                    review.setRating(5);
                    review.setComment("Amazing trip!");
                    review.setUser(traveler);
                    review.setTravelPackage(bali);
                    reviewRepository.save(review);
                }

                // ✅ 5. Create Sample Booking
                if (bookingRepository.count() == 0) {
                    Booking booking = new Booking();
                    booking.setStatus("CONFIRMED");
                    booking.setUser(traveler);
                    booking.setTravelPackage(bali);
                    booking.setFinalPrice(1299.99);
                    bookingRepository.save(booking);
                }
            }

            System.out.println("✅ Sample Data loaded successfully!");
        };
    }
}