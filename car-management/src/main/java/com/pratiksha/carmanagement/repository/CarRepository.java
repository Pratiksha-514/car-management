package com.pratiksha.carmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pratiksha.carmanagement.model.Car;

public interface CarRepository extends JpaRepository<Car, Long> {
}