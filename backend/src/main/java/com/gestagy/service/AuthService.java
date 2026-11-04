package com.gestagy.service;

import com.gestagy.dto.AuthDtos;
import com.gestagy.model.ActivityLog;
import com.gestagy.model.Profile;
import com.gestagy.model.RoleName;
import com.gestagy.model.User;
import com.gestagy.repository.ActivityLogRepository;
import com.gestagy.repository.UserRepository;
import com.gestagy.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthService(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            ActivityLogRepository activityLogRepository,
            PasswordEncoder passwordEncoder,
            JwtUtils jwtUtils
    ) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.activityLogRepository = activityLogRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public AuthDtos.AuthResponse register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .active(true)
                .build();

        Profile profile = Profile.builder()
                .user(user)
                .fullName(request.getFullName() != null ? request.getFullName() : request.getEmail())
                .phone(request.getPhone())
                .school(request.getSchool())
                .fieldOfStudy(request.getFieldOfStudy())
                .level(request.getLevel())
                .build();
        user.setProfile(profile);

        RoleName assignedRole = request.getRole() != null ? request.getRole() : RoleName.INTERN;
        user.addRole(assignedRole);

        User savedUser = userRepository.save(user);

        activityLogRepository.save(ActivityLog.builder()
                .user(savedUser)
                .action("USER_REGISTERED")
                .entity("User")
                .entityId(savedUser.getId())
                .details("Inscription de " + profile.getFullName() + " (" + assignedRole.name() + ")")
                .build());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateToken((UserDetails) authentication.getPrincipal());

        Set<String> roles = savedUser.getRoles().stream()
                .map(r -> r.getRole().name())
                .collect(Collectors.toSet());

        return AuthDtos.AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(profile.getFullName())
                .phone(profile.getPhone())
                .school(profile.getSchool())
                .fieldOfStudy(profile.getFieldOfStudy())
                .level(profile.getLevel())
                .avatarUrl(profile.getAvatarUrl())
                .roles(roles)
                .build();
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateToken((UserDetails) authentication.getPrincipal());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        Set<String> roles = user.getRoles().stream()
                .map(r -> r.getRole().name())
                .collect(Collectors.toSet());

        Profile p = user.getProfile();
        return AuthDtos.AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(p != null ? p.getFullName() : user.getEmail())
                .phone(p != null ? p.getPhone() : "")
                .school(p != null ? p.getSchool() : "")
                .fieldOfStudy(p != null ? p.getFieldOfStudy() : "")
                .level(p != null ? p.getLevel() : "")
                .avatarUrl(p != null ? p.getAvatarUrl() : null)
                .roles(roles)
                .build();
    }

    @Transactional(readOnly = true)
    public AuthDtos.UserProfileResponse getCurrentProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));
        return mapToUserProfile(user);
    }

    @Transactional
    public AuthDtos.UserProfileResponse updateProfile(String email, AuthDtos.UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        Profile profile = user.getProfile();
        if (profile == null) {
            profile = Profile.builder().user(user).fullName(user.getEmail()).build();
            user.setProfile(profile);
        }

        if (request.getFullName() != null && !request.getFullName().isBlank()) {
            profile.setFullName(request.getFullName());
        }
        if (request.getPhone() != null) profile.setPhone(request.getPhone());
        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl());
        if (request.getSchool() != null) profile.setSchool(request.getSchool());
        if (request.getFieldOfStudy() != null) profile.setFieldOfStudy(request.getFieldOfStudy());
        if (request.getLevel() != null) profile.setLevel(request.getLevel());

        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        User saved = userRepository.save(user);
        return mapToUserProfile(saved);
    }

    @Transactional(readOnly = true)
    public List<AuthDtos.UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserProfile)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AuthDtos.UserProfileResponse> getUsersByRole(RoleName role) {
        return userRepository.findAll().stream()
                .filter(u -> u.getRoles().stream().anyMatch(r -> r.getRole() == role))
                .map(this::mapToUserProfile)
                .collect(Collectors.toList());
    }

    @Transactional
    public AuthDtos.UserProfileResponse createAdminUser(AuthDtos.AdminUserRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Cet email existe déjà : " + request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(
                        request.getPassword() != null && !request.getPassword().isBlank()
                                ? request.getPassword()
                                : "password123"
                ))
                .active(request.getActive() == null || request.getActive())
                .build();

        Profile profile = Profile.builder()
                .user(user)
                .fullName(request.getFullName() != null ? request.getFullName() : request.getEmail())
                .phone(request.getPhone())
                .school(request.getSchool())
                .fieldOfStudy(request.getFieldOfStudy())
                .level(request.getLevel())
                .build();
        user.setProfile(profile);

        if (request.getRoles() != null && !request.getRoles().isEmpty()) {
            for (RoleName rn : request.getRoles()) {
                user.addRole(rn);
            }
        } else {
            user.addRole(RoleName.INTERN);
        }

        User saved = userRepository.save(user);
        return mapToUserProfile(saved);
    }

    @Transactional
    public AuthDtos.UserProfileResponse updateUserRolesAndStatus(Long userId, Set<RoleName> roles, Boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable : " + userId));

        if (active != null) {
            user.setActive(active);
        }
        if (roles != null && !roles.isEmpty()) {
            user.getRoles().clear();
            for (RoleName rn : roles) {
                user.addRole(rn);
            }
        }
        User saved = userRepository.save(user);
        return mapToUserProfile(saved);
    }

    private AuthDtos.UserProfileResponse mapToUserProfile(User user) {
        Profile profile = user.getProfile();
        Set<String> roles = user.getRoles().stream()
                .map(r -> r.getRole().name())
                .collect(Collectors.toSet());

        return AuthDtos.UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(profile != null ? profile.getFullName() : user.getEmail())
                .phone(profile != null ? profile.getPhone() : "")
                .avatarUrl(profile != null ? profile.getAvatarUrl() : "")
                .school(profile != null ? profile.getSchool() : "")
                .fieldOfStudy(profile != null ? profile.getFieldOfStudy() : "")
                .level(profile != null ? profile.getLevel() : "")
                .active(user.isActive())
                .roles(roles)
                .createdAt(user.getCreatedAt())
                .build();
    }
}
