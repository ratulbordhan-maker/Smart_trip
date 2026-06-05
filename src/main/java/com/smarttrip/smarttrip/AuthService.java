package com.smarttrip.smarttrip;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail());
        
        if (user == null) {
            return new AuthResponse(false, "User not found", null, null, null);
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(false, "Invalid password", null, null, null);
        }

        String token = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        AuthResponse.UserDTO userDTO = new AuthResponse.UserDTO(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole()
        );

        return new AuthResponse(true, "Login successful", token, refreshToken, userDTO);
    }

    public AuthResponse register(RegisterRequest request) {
        // Check if user already exists
        User existingUser = userRepository.findByEmail(request.getEmail());
        if (existingUser != null) {
            return new AuthResponse(false, "Email already registered", null, null, null);
        }

        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());

        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        AuthResponse.UserDTO userDTO = new AuthResponse.UserDTO(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole()
        );

        return new AuthResponse(true, "Registration successful", token, refreshToken, userDTO);
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken)) {
            return new AuthResponse(false, "Invalid refresh token", null, null, null);
        }

        String email = jwtUtil.getEmailFromToken(refreshToken);
        User user = userRepository.findByEmail(email);

        if (user == null) {
            return new AuthResponse(false, "User not found", null, null, null);
        }

        String newToken = jwtUtil.generateToken(user);
        String newRefreshToken = jwtUtil.generateRefreshToken(user);

        AuthResponse.UserDTO userDTO = new AuthResponse.UserDTO(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole()
        );

        return new AuthResponse(true, "Token refreshed", newToken, newRefreshToken, userDTO);
    }
}
