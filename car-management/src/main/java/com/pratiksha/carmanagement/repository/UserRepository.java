package com.pratiksha.carmanagement.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.pratiksha.carmanagement.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}
