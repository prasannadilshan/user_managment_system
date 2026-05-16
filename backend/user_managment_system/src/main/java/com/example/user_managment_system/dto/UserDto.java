package com.example.user_managment_system.dto;

import com.example.user_managment_system.model.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserDto {
    private String email;
    private String fullName;
    private String nic;
    private Role role;
}
