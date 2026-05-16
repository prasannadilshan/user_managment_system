package com.example.user_managment_system.controller;

import com.example.user_managment_system.dto.AuthRequest;
import com.example.user_managment_system.dto.AuthResponse;
import com.example.user_managment_system.dto.RegisterRequest;
import com.example.user_managment_system.dto.UserDto;
import com.example.user_managment_system.model.Role;
import com.example.user_managment_system.model.User;
import com.example.user_managment_system.repository.UserRepository;
import com.example.user_managment_system.security.JwtUtil;
import com.example.user_managment_system.security.UserDetailsImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails);
            User user = userDetails.getUser();

            UserDto userDto = UserDto.builder()
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .nic(user.getNic())
                    .role(user.getRole())
                    .build();

            return ResponseEntity.ok(new AuthResponse(jwt, userDto));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .fullName(request.getFullName())
                .password(passwordEncoder.encode(request.getPassword()))
                .nic(request.getNic())
                .role(Role.USER) // Default role
                .build();

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully");
    }
}
