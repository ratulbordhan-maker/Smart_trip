package com.smarttrip.smarttrip;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating;
    private String comment;

    @ManyToOne
    private User user;

    @ManyToOne
    @JsonIgnoreProperties(value = "reviews", allowSetters = true)
    private TravelPackage travelPackage;

    // getters
    public Long getId() { return id; }
    public int getRating() { return rating; }
    public String getComment() { return comment; }
    public User getUser() { return user; }
    public TravelPackage getTravelPackage() { return travelPackage; }

    // setters
    public void setId(Long id) { this.id = id; }
    public void setRating(int rating) { this.rating = rating; }
    public void setComment(String comment) { this.comment = comment; }
    public void setUser(User user) { this.user = user; }
    public void setTravelPackage(TravelPackage travelPackage) { this.travelPackage = travelPackage; }
}