package com.smarttrip.smarttrip;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CouponRepository extends JpaRepository<Coupon, Long> {
    List<Coupon> findByPackageId(Long packageId);
    Coupon findByCode(String code);
}