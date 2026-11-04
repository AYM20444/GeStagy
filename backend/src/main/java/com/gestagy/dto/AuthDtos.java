package com.gestagy.dto;

import com.gestagy.model.RoleName;

import java.time.LocalDateTime;
import java.util.Set;

public class AuthDtos {

    public static class LoginRequest {
        private String email;
        private String password;
        public LoginRequest() {}
        public LoginRequest(String email, String password) { this.email = email; this.password = password; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String email;
        private String password;
        private String fullName;
        private String phone;
        private String school;
        private String fieldOfStudy;
        private String level;
        private RoleName role;
        public RegisterRequest() {}
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getSchool() { return school; }
        public void setSchool(String school) { this.school = school; }
        public String getFieldOfStudy() { return fieldOfStudy; }
        public void setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public RoleName getRole() { return role; }
        public void setRole(RoleName role) { this.role = role; }
    }

    public static class UpdateProfileRequest {
        private String fullName;
        private String phone;
        private String avatarUrl;
        private String school;
        private String fieldOfStudy;
        private String level;
        private String newPassword;
        public UpdateProfileRequest() {}
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
        public String getSchool() { return school; }
        public void setSchool(String school) { this.school = school; }
        public String getFieldOfStudy() { return fieldOfStudy; }
        public void setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class AdminUserRequest {
        private String email;
        private String password;
        private String fullName;
        private String phone;
        private String school;
        private String fieldOfStudy;
        private String level;
        private Set<RoleName> roles;
        private Boolean active;
        public AdminUserRequest() {}
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getSchool() { return school; }
        public void setSchool(String school) { this.school = school; }
        public String getFieldOfStudy() { return fieldOfStudy; }
        public void setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public Set<RoleName> getRoles() { return roles; }
        public void setRoles(Set<RoleName> roles) { this.roles = roles; }
        public Boolean getActive() { return active; }
        public void setActive(Boolean active) { this.active = active; }
    }

    public static class AuthResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String email;
        private String fullName;
        private String phone;
        private String school;
        private String fieldOfStudy;
        private String level;
        private String avatarUrl;
        private Set<String> roles;

        public AuthResponse() {}
        public AuthResponse(String token, String type, Long id, String email, String fullName, String phone, String school, String fieldOfStudy, String level, String avatarUrl, Set<String> roles) {
            this.token = token;
            this.type = type != null ? type : "Bearer";
            this.id = id;
            this.email = email;
            this.fullName = fullName;
            this.phone = phone;
            this.school = school;
            this.fieldOfStudy = fieldOfStudy;
            this.level = level;
            this.avatarUrl = avatarUrl;
            this.roles = roles;
        }
        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getSchool() { return school; }
        public void setSchool(String school) { this.school = school; }
        public String getFieldOfStudy() { return fieldOfStudy; }
        public void setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
        public Set<String> getRoles() { return roles; }
        public void setRoles(Set<String> roles) { this.roles = roles; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private String token;
            private String type = "Bearer";
            private Long id;
            private String email;
            private String fullName;
            private String phone;
            private String school;
            private String fieldOfStudy;
            private String level;
            private String avatarUrl;
            private Set<String> roles;
            public Builder token(String token) { this.token = token; return this; }
            public Builder type(String type) { this.type = type; return this; }
            public Builder id(Long id) { this.id = id; return this; }
            public Builder email(String email) { this.email = email; return this; }
            public Builder fullName(String fullName) { this.fullName = fullName; return this; }
            public Builder phone(String phone) { this.phone = phone; return this; }
            public Builder school(String school) { this.school = school; return this; }
            public Builder fieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; return this; }
            public Builder level(String level) { this.level = level; return this; }
            public Builder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
            public Builder roles(Set<String> roles) { this.roles = roles; return this; }
            public AuthResponse build() { return new AuthResponse(token, type, id, email, fullName, phone, school, fieldOfStudy, level, avatarUrl, roles); }
        }
    }

    public static class UserProfileResponse {
        private Long id;
        private String email;
        private String fullName;
        private String phone;
        private String avatarUrl;
        private String school;
        private String fieldOfStudy;
        private String level;
        private boolean active;
        private Set<String> roles;
        private LocalDateTime createdAt;

        public UserProfileResponse() {}
        public UserProfileResponse(Long id, String email, String fullName, String phone, String avatarUrl, String school, String fieldOfStudy, String level, boolean active, Set<String> roles, LocalDateTime createdAt) {
            this.id = id;
            this.email = email;
            this.fullName = fullName;
            this.phone = phone;
            this.avatarUrl = avatarUrl;
            this.school = school;
            this.fieldOfStudy = fieldOfStudy;
            this.level = level;
            this.active = active;
            this.roles = roles;
            this.createdAt = createdAt;
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getAvatarUrl() { return avatarUrl; }
        public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
        public String getSchool() { return school; }
        public void setSchool(String school) { this.school = school; }
        public String getFieldOfStudy() { return fieldOfStudy; }
        public void setFieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public boolean isActive() { return active; }
        public void setActive(boolean active) { this.active = active; }
        public Set<String> getRoles() { return roles; }
        public void setRoles(Set<String> roles) { this.roles = roles; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private Long id;
            private String email;
            private String fullName;
            private String phone;
            private String avatarUrl;
            private String school;
            private String fieldOfStudy;
            private String level;
            private boolean active = true;
            private Set<String> roles;
            private LocalDateTime createdAt;
            public Builder id(Long id) { this.id = id; return this; }
            public Builder email(String email) { this.email = email; return this; }
            public Builder fullName(String fullName) { this.fullName = fullName; return this; }
            public Builder phone(String phone) { this.phone = phone; return this; }
            public Builder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
            public Builder school(String school) { this.school = school; return this; }
            public Builder fieldOfStudy(String fieldOfStudy) { this.fieldOfStudy = fieldOfStudy; return this; }
            public Builder level(String level) { this.level = level; return this; }
            public Builder active(boolean active) { this.active = active; return this; }
            public Builder roles(Set<String> roles) { this.roles = roles; return this; }
            public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
            public UserProfileResponse build() { return new UserProfileResponse(id, email, fullName, phone, avatarUrl, school, fieldOfStudy, level, active, roles, createdAt); }
        }
    }
}
