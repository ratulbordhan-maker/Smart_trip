package com.smarttrip.smarttrip;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserId(Long userId);
    
    Optional<Wishlist> findByUserIdAndTravelPackageId(Long userId, Long packageId);
    
    @Query("SELECT w FROM Wishlist w WHERE w.user.id = ?1 ORDER BY w.addedAt DESC")
    List<Wishlist> findUserWishlists(Long userId);
    
    void deleteByUserIdAndTravelPackageId(Long userId, Long packageId);
}
