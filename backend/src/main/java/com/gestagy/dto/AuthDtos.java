package com.gestagy.dto;

import com.gestagy.model.RoleName;
import lombok.*;

import java.util.Set;

public class AuthDtos {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class RegisterRequest {
        private String email;
        private String password;
        private String fullName;
        private String phone;
        private String school;
        private String fieldOfStudy;
        private String level;
        private RoleName role; // Default INTERN si non spécifié
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String email;
        private String fullName;
        private String avatarUrl;
        private Set<String> roles;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UserProfileResponse {
        private Long id;
        private String email;
        private String fullName;
        private String phone;
        private String avatarUrl;
        private String school;
        private String fieldOfStudy;
        private String level;
        private Set<String> roles;
    }
}

