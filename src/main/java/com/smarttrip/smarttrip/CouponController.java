package com.smarttrip.smarttrip;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/coupons")
@CrossOrigin(origins = "*")
public class CouponController {

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private TravelPackageRepository packageRepository;

    @PostMapping
    public Object createCoupon(@RequestBody Coupon coupon) {
        TravelPackage pkg = packageRepository.findById(coupon.getPackageId()).orElse(null);

        if (pkg == null) {
            return "Package not found";
        }

        if (!coupon.getType().equals("PERCENTAGE") && !coupon.getType().equals("FIXED")) {
            return "Coupon type must be PERCENTAGE or FIXED";
        }

        if (coupon.getDiscountValue() <= 0) {
            return "Discount value must be greater than 0";
        }

        if (coupon.getExpiryDate().isBefore(LocalDate.now())) {
            return "Expiry date cannot be in the past";
        }

        coupon.setStatus("ACTIVE");
        return couponRepository.save(coupon);
    }

    @GetMapping
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    @GetMapping("/package/{packageId}")
    public List<Coupon> getCouponsByPackage(@PathVariable Long packageId) {
        return couponRepository.findByPackageId(packageId);
    }

    @GetMapping("/validate/{code}")
    public Object validateCoupon(@PathVariable String code) {
        Coupon coupon = couponRepository.findByCode(code);

        if (coupon == null) {
            return "Invalid coupon code";
        }

        if (!coupon.getStatus().equals("ACTIVE")) {
            return "Coupon is inactive";
        }

        if (coupon.getExpiryDate().isBefore(LocalDate.now())) {
            return "Coupon has expired";
        }

        return coupon;
    }
}