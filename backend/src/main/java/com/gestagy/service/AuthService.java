package com.gestagy.service;

import com.gestagy.dto.AuthDtos;
import com.gestagy.model.Profile;
import com.gestagy.model.RoleName;
import com.gestagy.model.User;
import com.gestagy.repository.UserRepository;
import com.gestagy.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

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
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .school(request.getSchool())
                .fieldOfStudy(request.getFieldOfStudy())
                .level(request.getLevel())
                .build();
        user.setProfile(profile);

        RoleName assignedRole = request.getRole() != null ? request.getRole() : RoleName.INTERN;
        user.addRole(assignedRole);

        User savedUser = userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateToken((org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal());

        Set<String> roles = savedUser.getRoles().stream()
                .map(r -> r.getRole().name())
                .collect(Collectors.toSet());

        return AuthDtos.AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(savedUser.getId())
                .email(savedUser.getEmail())
                .fullName(profile.getFullName())
                .avatarUrl(profile.getAvatarUrl())
                .roles(roles)
                .build();
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = jwtUtils.generateToken((org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        Set<String> roles = user.getRoles().stream()
                .map(r -> r.getRole().name())
                .collect(Collectors.toSet());

        String fullName = user.getProfile() != null ? user.getProfile().getFullName() : user.getEmail();
        String avatarUrl = user.getProfile() != null ? user.getProfile().getAvatarUrl() : null;

        return AuthDtos.AuthResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .fullName(fullName)
                .avatarUrl(avatarUrl)
                .roles(roles)
                .build();
    }

    @Transactional(readOnly = true)
    public AuthDtos.UserProfileResponse getCurrentProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        Profile profile = user.getProfile();
        Set<String> roles = user.getRoles().stream()
                .map(r -> r.getRole().name())
                .collect(Collectors.toSet());

        return AuthDtos.UserProfileResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(profile != null ? profile.getFullName() : "")
                .phone(profile != null ? profile.getPhone() : "")
                .avatarUrl(profile != null ? profile.getAvatarUrl() : "")
                .school(profile != null ? profile.getSchool() : "")
                .fieldOfStudy(profile != null ? profile.getFieldOfStudy() : "")
                .level(profile != null ? profile.getLevel() : "")
                .roles(roles)
                .build();
    }
}

