package com.smarttrip.smarttrip;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // ✅ Used for Login
    Optional<User> findByEmail(String email);

    // ✅ Used for Registration (Check if email is already taken)
    // This is more efficient than findByEmail().isPresent()
    boolean existsByEmail(String email);
    
    // ✅ Find all users by role (Useful for Admin dashboards)
    java.util.List<User> findByRole(String role);
}