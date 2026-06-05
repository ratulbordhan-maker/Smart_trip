package com.smarttrip.smarttrip;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlists")
@CrossOrigin(origins = "*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Wishlist>> getUserWishlists(@PathVariable Long userId) {
        List<Wishlist> wishlists = wishlistService.getUserWishlists(userId);
        return ResponseEntity.ok(wishlists);
    }

    @PostMapping("/add/{packageId}")
    public ResponseEntity<?> addToWishlist(
            @PathVariable Long packageId,
            @RequestAttribute("userId") Long userId) {
        try {
            wishlistService.addToWishlist(userId, packageId);
            return ResponseEntity.ok(Map.of("message", "Package added to wishlist"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/remove/{packageId}")
    public ResponseEntity<?> removeFromWishlist(
            @PathVariable Long packageId,
            @RequestAttribute("userId") Long userId) {
        try {
            wishlistService.removeFromWishlist(userId, packageId);
            return ResponseEntity.ok(Map.of("message", "Package removed from wishlist"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/check/{packageId}")
    public ResponseEntity<Map<String, Boolean>> checkWishlist(
            @PathVariable Long packageId,
            @RequestAttribute("userId") Long userId) {
        boolean isInWishlist = wishlistService.isInWishlist(userId, packageId);
        return ResponseEntity.ok(Map.of("inWishlist", isInWishlist));
    }
}
