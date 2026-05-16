package com.example.user_managment_system.controller;

import com.example.user_managment_system.dto.RegisterRequest;
import com.example.user_managment_system.dto.UserDto;
import com.example.user_managment_system.model.Role;
import com.example.user_managment_system.model.User;
import com.example.user_managment_system.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userRepository.findAll().stream()
                .map(user -> UserDto.builder()
                        .email(user.getEmail())
                        .fullName(user.getFullName())
                        .nic(user.getNic())
                        .role(user.getRole())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already in use.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .fullName(request.getFullName())
                .password(passwordEncoder.encode(request.getPassword()))
                .nic(request.getNic())
                .role(Role.USER) // Admins create users by default unless specified
                .build();

        userRepository.save(user);
        return ResponseEntity.ok("User created successfully");
    }

    @PutMapping("/{email}")
    public ResponseEntity<?> updateUser(@PathVariable String email, @RequestBody RegisterRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();
        user.setFullName(request.getFullName());
        user.setNic(request.getNic());
        
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userRepository.save(user);
        return ResponseEntity.ok("User updated successfully");
    }

    @DeleteMapping("/{email}")
    public ResponseEntity<?> deleteUser(@PathVariable String email) {
        if (!userRepository.existsById(email)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(email);
        return ResponseEntity.ok("User deleted successfully");
    }
}
