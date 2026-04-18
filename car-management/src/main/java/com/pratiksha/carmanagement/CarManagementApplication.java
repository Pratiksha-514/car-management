package com.pratiksha.carmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import com.pratiksha.carmanagement.model.User;
import com.pratiksha.carmanagement.repository.UserRepository;

@SpringBootApplication
public class CarManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(CarManagementApplication.class, args);
	}

	@Bean
	CommandLineRunner init(UserRepository repository) {
		return args -> {
			// Seed or Update Admin User
			User existingAdmin = repository.findByEmail("admin@gmail.com");
			if (existingAdmin == null) {
				User admin = new User();
				admin.setEmail("admin@gmail.com");
				admin.setPassword("admin123");
				admin.setRole("ADMIN");
				repository.save(admin);
				System.out.println("✅ Default Admin Created: admin@gmail.com / admin123");
			} else {
				// Ensure password and role are correct if user exists
				existingAdmin.setPassword("admin123");
				existingAdmin.setRole("ADMIN");
				repository.save(existingAdmin);
				System.out.println("✅ Admin Credentials Updated: admin@gmail.com / admin123");
			}
		};
	}

}
