package com.smarttrip.smarttrip;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // PENDING → CONFIRMED (approved by agency) or CANCELLED
    private String status = "PENDING";

    private String travelDate;
    private int numberOfTravelers;
    private String couponCode;
    private double totalPrice;
    private double finalPrice; // after discount

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("password")
    private User user;

    @ManyToOne
    // FIX: explicitly name the FK column to match what already exists in the DB.
    // Without @JoinColumn, JPA defaults to "travel_package_id" but the table was
    // originally created with "package_id", causing the insert to fail.
    @JoinColumn(name = "package_id")
    @JsonIgnoreProperties("reviews")
    private TravelPackage travelPackage;

    // ── Getters ──────────────────────────────────────────
    public Long getId()                   { return id; }
    public String getStatus()             { return status; }
    public String getTravelDate()         { return travelDate; }
    public int getNumberOfTravelers()     { return numberOfTravelers; }
    public String getCouponCode()         { return couponCode; }
    public double getTotalPrice()         { return totalPrice; }
    public double getFinalPrice()         { return finalPrice; }
    public User getUser()                 { return user; }
    public TravelPackage getTravelPackage() { return travelPackage; }

    // ── Setters ──────────────────────────────────────────
    public void setId(Long id)                        { this.id = id; }
    public void setStatus(String status)              { this.status = status; }
    public void setTravelDate(String travelDate)      { this.travelDate = travelDate; }
    public void setNumberOfTravelers(int n)           { this.numberOfTravelers = n; }
    public void setCouponCode(String code)            { this.couponCode = code; }
    public void setTotalPrice(double p)               { this.totalPrice = p; }
    public void setFinalPrice(double p)               { this.finalPrice = p; }
    public void setUser(User user)                    { this.user = user; }
    public void setTravelPackage(TravelPackage pkg)   { this.travelPackage = pkg; }
}