package com.smarttrip.smarttrip;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TravelPackageRepository extends JpaRepository<TravelPackage, Long> {
    List<TravelPackage> findByStatus(String status);
}