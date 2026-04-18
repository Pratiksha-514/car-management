package com.pratiksha.carmanagement.model;

import jakarta.persistence.*;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phoneNumber;
    private String address;
    private String date;
    private String preferredDate;
    private Long carId;
    private String carName;
    private String carBrand;
    private double price;
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED

    // GETTERS
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getAddress() { return address; }
    public String getDate() { return date; }
    public String getPreferredDate() { return preferredDate; }
    public Long getCarId() { return carId; }
    public String getCarName() { return carName; }
    public String getCarBrand() { return carBrand; }
    public double getPrice() { return price; }
    public String getStatus() { return status; }

    // SETTERS
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setAddress(String address) { this.address = address; }
    public void setDate(String date) { this.date = date; }
    public void setPreferredDate(String preferredDate) { this.preferredDate = preferredDate; }
    public void setCarId(Long carId) { this.carId = carId; }
    public void setCarName(String carName) { this.carName = carName; }
    public void setCarBrand(String carBrand) { this.carBrand = carBrand; }
    public void setPrice(double price) { this.price = price; }
    public void setStatus(String status) { this.status = status; }
}