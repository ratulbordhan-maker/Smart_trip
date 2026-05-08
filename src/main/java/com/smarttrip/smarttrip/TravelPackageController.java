package com.smarttrip.smarttrip;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/packages")
@CrossOrigin(origins = "*") // ✅ FIX: was missing — caused CORS errors on all package operations
public class TravelPackageController {

    @Autowired
    private TravelPackageRepository repository;

    // ✅ Create Package
    @PostMapping
    public TravelPackage createPackage(@RequestBody TravelPackage pkg) {
        if (pkg.getAvailableSlots() == 0 && pkg.getTotalSlots() > 0) {
            pkg.setAvailableSlots(pkg.getTotalSlots());
        }
        return repository.save(pkg);
    }

    // ✅ Get All Packages (traveler / admin browsing)
    @GetMapping
    public List<TravelPackage> getAllPackages() {
        return repository.findAll();
    }

    // ✅ FIX: Get packages by agency — was missing, frontend filtered client-side
    //    which broke when data was large or createdBy type mismatched
    @GetMapping("/agency/{agencyId}")
    public List<TravelPackage> getPackagesByAgency(@PathVariable Long agencyId) {
        return repository.findByCreatedBy(agencyId);
    }

    // ✅ Get Package by ID
    @GetMapping("/{id}")
    public TravelPackage getPackageById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));
    }

    // ✅ FIX: Update Package — now updates ALL fields including slots and coupon data
    @PutMapping("/{id}")
    public TravelPackage updatePackage(@PathVariable Long id, @RequestBody TravelPackage updated) {
        TravelPackage pkg = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found"));

        pkg.setTitle(updated.getTitle());
        pkg.setDestination(updated.getDestination());
        pkg.setPrice(updated.getPrice());
        pkg.setDescription(updated.getDescription());
        pkg.setTravelDate(updated.getTravelDate());
        pkg.setTotalSlots(updated.getTotalSlots());
        pkg.setAvailableSlots(updated.getAvailableSlots());
        pkg.setCouponCode(updated.getCouponCode());
        pkg.setDiscountValue(updated.getDiscountValue());
        pkg.setDiscountType(updated.getDiscountType());
        pkg.setCouponExpiry(updated.getCouponExpiry());
        // preserve createdBy — never let a PUT overwrite ownership
        if (updated.getCreatedBy() != null) {
            pkg.setCreatedBy(updated.getCreatedBy());
        }

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