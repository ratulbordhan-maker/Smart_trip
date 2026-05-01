package com.smarttrip.smarttrip;

import jakarta.persistence.*;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;
    @ManyToOne
    private User user;

    @ManyToOne
    private TravelPackage travelPackage;

    private double finalPrice;

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public TravelPackage getTravelPackage() {
        return travelPackage;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setTravelPackage(TravelPackage travelPackage) {
        this.travelPackage = travelPackage;
    }

    public double getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(double finalPrice) {
        this.finalPrice = finalPrice;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}