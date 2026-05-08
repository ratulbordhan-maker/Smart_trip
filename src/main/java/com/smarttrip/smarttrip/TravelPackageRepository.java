package com.smarttrip.smarttrip;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TravelPackageRepository extends JpaRepository<TravelPackage, Long> {

    // ✅ FIX: was missing — needed for /packages/agency/{id} endpoint
    List<TravelPackage> findByCreatedBy(Long agencyId);

    // ✅ Useful for traveler browse view (only show active packages)
    List<TravelPackage> findByActiveTrue();
}