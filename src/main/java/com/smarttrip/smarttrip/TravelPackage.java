package com.smarttrip.smarttrip;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@JsonIgnoreProperties({"reviews"})
public class TravelPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String description;
    private String travelDate;
    private String title;
    private String destination;
    private double price;
    private Long createdBy; // agency id
    private int availableSlots;
    private int totalSlots;
    private boolean active = true;
    private String couponCode;
    private double discountValue;
    private String discountType;
    private String couponExpiry;

    @OneToMany(mappedBy = "travelPackage", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Review> reviews = new ArrayList<>();

    // Getters
    public Long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public String getTravelDate() {
        return travelDate;
    }

    public String getTitle() {
        return title;
    }

    public String getDestination() {
        return destination;
    }

    public double getPrice() {
        return price;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public int getAvailableSlots() {
        return availableSlots;
    }

    public int getTotalSlots() {
        return totalSlots;
    }

    public boolean isActive() {
        return active;
    }

    public String getCouponCode() {
        return couponCode;
    }

    public double getDiscountValue() {
        return discountValue;
    }

    public String getDiscountType() {
        return discountType;
    }

    public String getCouponExpiry() {
        return couponExpiry;
    }

    public List<Review> getReviews() {
        return reviews;
    }

    public void setReviews(List<Review> reviews) {
        this.reviews = reviews;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setTravelDate(String travelDate) {
        this.travelDate = travelDate;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public void setAvailableSlots(int availableSlots) {
        this.availableSlots = availableSlots;
    }

    public void setTotalSlots(int totalSlots) {
        this.totalSlots = totalSlots;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public void setCouponCode(String couponCode) {
        this.couponCode = couponCode;
    }

    public void setDiscountValue(double discountValue) {
        this.discountValue = discountValue;
    }

    public void setDiscountType(String discountType) {
        this.discountType = discountType;
    }

    public void setCouponExpiry(String couponExpiry) {
        this.couponExpiry = couponExpiry;
    }
}