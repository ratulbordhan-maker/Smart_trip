package com.smarttrip.smarttrip;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TravelPackageRepository travelPackageRepository;

    // add review
    @PostMapping
    public Review addReview(@RequestBody Review review) {
        User user = userRepository.findById(review.getUser().getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        TravelPackage travelPackage = travelPackageRepository.findById(review.getTravelPackage().getId())
                .orElseThrow(() -> new RuntimeException("Package not found"));

        review.setUser(user);
        review.setTravelPackage(travelPackage);

        return reviewRepository.save(review);
    }

    // get reviews by package
    @GetMapping("/package/{id}")
    public List<Review> getReviews(@PathVariable Long id) {
        return reviewRepository.findByTravelPackageId(id);
    }
}