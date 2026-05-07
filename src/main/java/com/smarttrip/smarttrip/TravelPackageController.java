package com.smarttrip.smarttrip;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/packages")   // ← Important: Matches frontend
@CrossOrigin(origins = "http://localhost:3000")
public class TravelPackageController {

    @Autowired
    private TravelPackageRepository repository;

    // ✅ Create Package
    @PostMapping
    public TravelPackage createPackage(@RequestBody TravelPackage pkg) {
        if (pkg.getTitle() == null || pkg.getTitle().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required");
        }
        if (pkg.getPrice() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Price must be positive");
        }
        if (pkg.getTotalSlots() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Total slots must be greater than 0");
        }

        // Auto set available slots
        if (pkg.getAvailableSlots() == 0) {
            pkg.setAvailableSlots(pkg.getTotalSlots());
        }

        pkg.setActive(true);
        return repository.save(pkg);
    }

    // ✅ Get All Packages
    @GetMapping
    public List<TravelPackage> getAllPackages() {
        return repository.findAll();
    }

    // ✅ Deactivate Package
    @PutMapping("/{id}/deactivate")
    public TravelPackage deactivatePackage(@PathVariable Long id) {
        TravelPackage pkg = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Package not found"));

        pkg.setActive(false);
        return repository.save(pkg);
    }
}