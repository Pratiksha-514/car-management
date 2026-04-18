package com.pratiksha.carmanagement.controller;

import org.springframework.web.bind.annotation.*;
import com.pratiksha.carmanagement.model.User;
import com.pratiksha.carmanagement.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    private final UserRepository repo;

    public AuthController(UserRepository repo) {
        this.repo = repo;
    }

    // 🔹 Register
    @CrossOrigin("*")
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (repo.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }
        
        // Force role to USER to prevent unauthorized admins
        user.setRole("USER");
        
        return ResponseEntity.ok(repo.save(user));
    }

    // 🔹 Login
    @CrossOrigin("*")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        User existing = repo.findByEmail(user.getEmail());

        if (existing == null) {
            return ResponseEntity.status(404).body("User not found ❌");
        }

        if (!existing.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials ❌");
        }

        return ResponseEntity.ok(existing); // 200 OK with User data
    }

    // 🔹 Get all users
    @CrossOrigin("*")
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    // 🔹 Delete user
    @CrossOrigin("*")
    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
