package com.example.user_managment_system.dto;

import lombok.Data;
import jakarta.validation.constraints.*;

@Data
public class RegisterRequest {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String fullName;

    @NotBlank
    @Size(min = 6)
    private String password;

    @NotBlank
    @Pattern(regexp = "^[0-9]{9}[vVxX]?|[0-9]{12}$", message = "Invalid NIC format")
    private String nic;
}
