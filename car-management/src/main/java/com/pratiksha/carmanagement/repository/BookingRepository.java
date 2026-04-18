package com.pratiksha.carmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pratiksha.carmanagement.model.Booking;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByEmail(String email);
}