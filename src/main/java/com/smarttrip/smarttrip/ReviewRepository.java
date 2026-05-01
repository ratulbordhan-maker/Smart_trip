package com.smarttrip.smarttrip;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTravelPackageId(Long packageId);
    List<Review> findByUser(User user);
    void deleteByUserId(Long userId);
}