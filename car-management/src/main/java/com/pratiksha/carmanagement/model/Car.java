package com.pratiksha.carmanagement.model;

import jakarta.persistence.*;

@Entity
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String brand;
    private double price;

    // 🔥 ADD THIS FIELD
    private String imageUrl;

    private boolean available = true; // ✅ NEW FIELD

    // GETTERS
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getBrand() {
        return brand;
    }

    public double getPrice() {
        return price;
    }

    public String getImageUrl() {   // ✅ NEW
        return imageUrl;
    }

    public boolean isAvailable() { // ✅ NEW
        return available;
    }

    // SETTERS
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setImageUrl(String imageUrl) {   // ✅ NEW
        setAvailable(true); // Default to true when adding images
        this.imageUrl = imageUrl;
    }

    public void setAvailable(boolean available) { // ✅ NEW
        this.available = available;
    }
}