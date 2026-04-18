package com.pratiksha.carmanagement.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.pratiksha.carmanagement.model.Car;
import com.pratiksha.carmanagement.repository.CarRepository;

@RestController
@RequestMapping("/cars")
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.PATCH, RequestMethod.OPTIONS})
public class CarController {


    private final CarRepository repo;

    public CarController(CarRepository repo) {
        this.repo = repo;
    }

    // ✅ GET all cars
    @GetMapping
    public List<Car> getAllCars() {
        return repo.findAll();
    }

    // ✅ POST add car
    @PostMapping
    public Car addCar(@RequestBody Car car) {
        return repo.save(car);
    }

    // 🔥 UPDATED PUT (SAFE UPDATE)
    @PutMapping("/{id}")
    public Car updateCar(@PathVariable Long id, @RequestBody Car updatedCar) {

        Car existingCar = repo.findById(id).orElse(null);

        if (existingCar == null) {
            return null;
        }

        // update only if values are provided
        if (updatedCar.getName() != null)
            existingCar.setName(updatedCar.getName());

        if (updatedCar.getBrand() != null)
            existingCar.setBrand(updatedCar.getBrand());

        if (updatedCar.getPrice() != 0)
            existingCar.setPrice(updatedCar.getPrice());

        // 🔥 FIX: image update safely
        if (updatedCar.getImageUrl() != null && !updatedCar.getImageUrl().isEmpty())
            existingCar.setImageUrl(updatedCar.getImageUrl());

        return repo.save(existingCar);
    }

    // ✅ PATCH toggle availability
    @PatchMapping("/{id}/availability")
    public Car toggleAvailability(@PathVariable Long id) {
        Car car = repo.findById(id).orElse(null);
        if (car == null) return null;
        car.setAvailable(!car.isAvailable());
        return repo.save(car);
    }

    // ✅ DELETE car
    @DeleteMapping("/{id}")
    public String deleteCar(@PathVariable Long id) {

        if (!repo.existsById(id)) {
            return "Car not found with id " + id;
        }

        repo.deleteById(id);
        return "Car deleted successfully with id " + id;
    }
}