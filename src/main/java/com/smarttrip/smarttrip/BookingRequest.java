package com.smarttrip.smarttrip;

import java.time.LocalDate;

public class BookingRequest {
    private Long userId;
    private Long packageId;
    private LocalDate travelDate;
    private int numberOfTravelers = 1;
    private String couponCode;

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getPackageId() { return packageId; }
    public void setPackageId(Long packageId) { this.packageId = packageId; }

    public LocalDate getTravelDate() { return travelDate; }
    public void setTravelDate(LocalDate travelDate) { this.travelDate = travelDate; }

    public int getNumberOfTravelers() { return numberOfTravelers; }
    public void setNumberOfTravelers(int numberOfTravelers) { 
        this.numberOfTravelers = numberOfTravelers; 
    }

    public String getCouponCode() { return couponCode; }
    public void setCouponCode(String couponCode) { this.couponCode = couponCode; }
}
