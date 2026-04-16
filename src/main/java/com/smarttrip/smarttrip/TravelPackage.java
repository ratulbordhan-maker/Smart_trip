package com.smarttrip.smarttrip;

import jakarta.persistence.*;

@Entity
public class TravelPackage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String destination;
    private double price;

    public Long getId() {
        return id;
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

    public void setId(Long id) {
        this.id = id;
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
}
