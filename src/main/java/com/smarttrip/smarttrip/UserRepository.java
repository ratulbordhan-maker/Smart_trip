package com.smarttrip.smarttrip;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // ✅ Removed findByEmailAndPassword — it compared plain text against a BCrypt
    //    hash so it could never match. Login correctly uses passwordEncoder.matches().
    Optional<User> findByEmail(String email);

}