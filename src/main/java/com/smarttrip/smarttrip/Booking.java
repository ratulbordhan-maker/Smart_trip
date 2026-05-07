package com.smarttrip.smarttrip;

import jakarta.persistence.*;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Default status: PENDING, CONFIRMED, REJECTED, CANCELLED
    private String status;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "package_id", nullable = false)
    private TravelPackage travelPackage;

    // 💰 This is the price at the time of booking (snapshot)
    private double finalPrice;

    // Default Constructor
    public Booking() {}

    // GETTERS
    public Long getId() { return id; }
    public String getStatus() { return status; }
    public User getUser() { return user; }
    public TravelPackage getTravelPackage() { return travelPackage; }
    public double getFinalPrice() { return finalPrice; }

    // SETTERS
    public void setId(Long id) { this.id = id; }
    public void setStatus(String status) { this.status = status; }
    public void setUser(User user) { this.user = user; }
    public void setTravelPackage(TravelPackage travelPackage) { this.travelPackage = travelPackage; }
    public void setFinalPrice(double finalPrice) { this.finalPrice = finalPrice; }
}