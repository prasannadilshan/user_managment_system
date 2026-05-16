package com.example.user_managment_system.config;

import com.example.user_managment_system.model.Role;
import com.example.user_managment_system.model.User;
import com.example.user_managment_system.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@admin.com";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .email(adminEmail)
                    .fullName("System Administrator")
                    .password(passwordEncoder.encode("admin123"))
                    .nic("123456789")
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            System.out.println("Default admin user created: admin@admin.com / admin123");
        }
    }
}
