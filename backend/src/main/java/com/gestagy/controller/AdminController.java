package com.gestagy.controller;

import com.gestagy.dto.AuthDtos;
import com.gestagy.dto.OfferDtos;
import com.gestagy.model.RoleName;
import com.gestagy.service.AuthService;
import com.gestagy.service.OfferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@Tag(name = "Administration", description = "Gestion des utilisateurs, des rôles et des départements")
public class AdminController {

    private final AuthService authService;
    private final OfferService offerService;

    public AdminController(AuthService authService, OfferService offerService) {
        this.authService = authService;
        this.offerService = offerService;
    }

    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @Operation(summary = "Lister tous les utilisateurs et leurs rôles")
    public ResponseEntity<List<AuthDtos.UserProfileResponse>> getAllUsers() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @PostMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @Operation(summary = "Créer un nouvel utilisateur avec ses rôles")
    public ResponseEntity<AuthDtos.UserProfileResponse> createUser(@RequestBody AuthDtos.AdminUserRequest request) {
        return ResponseEntity.ok(authService.createAdminUser(request));
    }

    @PatchMapping("/users/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @Operation(summary = "Modifier les rôles ou le statut actif d'un utilisateur")
    public ResponseEntity<AuthDtos.UserProfileResponse> updateUser(
            @PathVariable Long id,
            @RequestBody AuthDtos.AdminUserRequest request
    ) {
        Set<RoleName> roles = request.getRoles();
        Boolean active = request.getActive();
        return ResponseEntity.ok(authService.updateUserRolesAndStatus(id, roles, active));
    }

    @GetMapping("/departments")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER', 'TUTOR')")
    @Operation(summary = "Lister tous les départements avec statistiques")
    public ResponseEntity<List<OfferDtos.DepartmentResponse>> getDepartments() {
        return ResponseEntity.ok(offerService.getAllDepartments());
    }

    @PostMapping("/departments")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @Operation(summary = "Créer un nouveau département")
    public ResponseEntity<OfferDtos.DepartmentResponse> createDepartment(@RequestBody OfferDtos.DepartmentRequest request) {
        return ResponseEntity.ok(offerService.createDepartment(request));
    }

    @PutMapping("/departments/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @Operation(summary = "Mettre à jour un département")
    public ResponseEntity<OfferDtos.DepartmentResponse> updateDepartment(
            @PathVariable Long id,
            @RequestBody OfferDtos.DepartmentRequest request
    ) {
        return ResponseEntity.ok(offerService.updateDepartment(id, request));
    }
}

