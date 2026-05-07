package com.smarttrip.smarttrip;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // ✅ Used to show a user their booking history
    List<Booking> findByUserId(Long userId);

    // ✅ Used in BookingService to prevent double-booking the same trip
    boolean existsByUserIdAndTravelPackageId(Long userId, Long travelPackageId);

    // ✅ REQUIRED for UserController's deleteUser method
    @Modifying
    @Transactional
    void deleteByUserId(Long userId);
    
    // ✅ Bonus: Helpful for the Agency Dashboard to see who booked their trips
    List<Booking> findByTravelPackageId(Long packageId);
}
