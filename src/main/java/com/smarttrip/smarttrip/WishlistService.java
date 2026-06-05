package com.smarttrip.smarttrip;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TravelPackageRepository packageRepository;

    public List<Wishlist> getUserWishlists(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return wishlistRepository.findUserWishlists(userId);
    }

    public void addToWishlist(Long userId, Long packageId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        TravelPackage travelPackage = packageRepository.findById(packageId)
                .orElseThrow(() -> new ResourceNotFoundException("Package not found"));

        if (wishlistRepository.findByUserIdAndTravelPackageId(userId, packageId).isPresent()) {
            throw new DuplicateResourceException("Package already in wishlist");
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setTravelPackage(travelPackage);
        wishlistRepository.save(wishlist);
    }

    public void removeFromWishlist(Long userId, Long packageId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        wishlistRepository.deleteByUserIdAndTravelPackageId(userId, packageId);
    }

    public boolean isInWishlist(Long userId, Long packageId) {
        return wishlistRepository.findByUserIdAndTravelPackageId(userId, packageId).isPresent();
    }
}
