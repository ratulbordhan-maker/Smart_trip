package com.smarttrip.smarttrip;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/packages")
public class TravelPackageController {

    @Autowired
    private TravelPackageRepository repository;

    // ✅ Create Package
    @PostMapping
    public TravelPackage createPackage(@RequestBody TravelPackage pkg) {
        return repository.save(pkg);
    }

    // ✅ Get All Packages (Browsing)
    @GetMapping
    public List<TravelPackage> getAllPackages() {
        return repository.findAll();
    }

    // ✅ Get Package by ID
    @GetMapping("/{id}")
    public TravelPackage getPackageById(@PathVariable Long id) {
        return repository.findById(id).orElseThrow();
    }

    // ✅ Update Package
    @PutMapping("/{id}")
    public TravelPackage updatePackage(@PathVariable Long id, @RequestBody TravelPackage updated) {
        TravelPackage pkg = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        pkg.setTitle(updated.getTitle());
        pkg.setDestination(updated.getDestination());
        pkg.setPrice(updated.getPrice());
        pkg.setDescription(updated.getDescription());
        pkg.setTravelDate(updated.getTravelDate());

        return repository.save(pkg);
    }

    // ✅ Deactivate Package
    @PutMapping("/{id}/deactivate")
    public TravelPackage deactivatePackage(@PathVariable Long id) {
        TravelPackage pkg = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        pkg.setActive(false);

        return repository.save(pkg);
    }
}