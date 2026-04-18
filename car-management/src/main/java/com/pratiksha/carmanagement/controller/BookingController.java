package com.pratiksha.carmanagement.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.pratiksha.carmanagement.model.Booking;
import com.pratiksha.carmanagement.repository.BookingRepository;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS})
public class BookingController {


    private final BookingRepository repo;
    private final com.pratiksha.carmanagement.repository.CarRepository carRepo; // ✅ NEW

    public BookingController(BookingRepository repo, com.pratiksha.carmanagement.repository.CarRepository carRepo) {
        this.repo = repo;
        this.carRepo = carRepo;
    }

    // 🔹 Add booking
    @PostMapping
    public org.springframework.http.ResponseEntity<?> addBooking(@RequestBody Booking booking) {
        // Check car availability
        com.pratiksha.carmanagement.model.Car car = carRepo.findById(booking.getCarId()).orElse(null);
        if (car == null) {
            return org.springframework.http.ResponseEntity.badRequest().body("Car not found ❌");
        }
        if (!car.isAvailable()) {
            return org.springframework.http.ResponseEntity.badRequest().body("Car is already booked or not available! 🚗");
        }

        // Set initial status
        booking.setStatus("PENDING");
        Booking saved = repo.save(booking);
        return org.springframework.http.ResponseEntity.ok(saved);
    }

    // 🔹 Update booking status
    @PutMapping("/{id}/status")
    public org.springframework.http.ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody String status) {
        Booking booking = repo.findById(id).orElseThrow();
        String newStatus = status.replace("\"", "");
        
        // If accepted, mark the car as unavailable
        if ("ACCEPTED".equals(newStatus)) {
            booking.setStatus(newStatus);
            com.pratiksha.carmanagement.model.Car car = carRepo.findById(booking.getCarId()).orElse(null);
            if (car != null) {
                car.setAvailable(false);
                carRepo.save(car);
            }
            return org.springframework.http.ResponseEntity.ok(repo.save(booking));
        } else if ("REJECTED".equals(newStatus)) {
            // If rejected, mark car available and DELETE the booking
            com.pratiksha.carmanagement.model.Car car = carRepo.findById(booking.getCarId()).orElse(null);
            if (car != null) {
                car.setAvailable(true);
                carRepo.save(car);
            }
            repo.deleteById(id);
            return org.springframework.http.ResponseEntity.ok("Booking rejected and removed ✅");
        }

        booking.setStatus(newStatus);
        return org.springframework.http.ResponseEntity.ok(repo.save(booking));
    }

    // 🔹 Get bookings by user email
    @GetMapping("/user/{email}")
    public List<Booking> getBookingsByEmail(@PathVariable String email) {
        return repo.findByEmail(email);
    }

    // 🔹 Get all bookings
    @GetMapping
    public List<Booking> getBookings() {
        return repo.findAll();
    }

    // 🔹 Delete a booking
    @DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return org.springframework.http.ResponseEntity.badRequest().body("Booking not found");
        }
        repo.deleteById(id);
        return org.springframework.http.ResponseEntity.ok("Booking deleted ✅");
    }
}