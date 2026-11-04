package com.gestagy.controller;

import com.gestagy.dto.InternshipDtos;
import com.gestagy.model.Task;
import com.gestagy.service.InternshipService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internships")
@RequiredArgsConstructor
@Tag(name = "Internships & Tasks", description = "Gestion du suivi de stage, des tâches Kanban et des évaluations")
public class InternshipController {

    private final InternshipService internshipService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER')")
    @Operation(summary = "Lister tous les stages de l'entreprise")
    public ResponseEntity<List<InternshipDtos.InternshipResponse>> getAllInternships() {
        return ResponseEntity.ok(internshipService.getAllInternships());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'TUTOR', 'INTERN')")
    @Operation(summary = "Obtenir les détails complets d'un stage")
    public ResponseEntity<InternshipDtos.InternshipResponse> getInternshipById(@PathVariable Long id) {
        return ResponseEntity.ok(internshipService.getInternshipById(id));
    }

    @GetMapping("/{id}/tasks")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'TUTOR', 'INTERN')")
    @Operation(summary = "Lister les tâches associées à un stage (pour le Kanban stagiaire)")
    public ResponseEntity<List<InternshipDtos.TaskResponse>> getTasks(@PathVariable Long id) {
        return ResponseEntity.ok(internshipService.getTasksByInternship(id));
    }

    @PostMapping("/{id}/tasks")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'TUTOR')")
    @Operation(summary = "Créer une nouvelle tâche pour un stagiaire")
    public ResponseEntity<InternshipDtos.TaskResponse> createTask(
            @PathVariable Long id,
            @RequestBody InternshipDtos.TaskRequest request,
            Authentication auth
    ) {
        return ResponseEntity.ok(internshipService.createTask(id, request, auth.getName()));
    }

    @PatchMapping("/tasks/{taskId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'TUTOR', 'INTERN')")
    @Operation(summary = "Mettre à jour le statut d'une tâche (TODO, IN_PROGRESS, DONE)")
    public ResponseEntity<InternshipDtos.TaskResponse> updateTaskStatus(
            @PathVariable Long taskId,
            @RequestParam Task.TaskStatus status
    ) {
        return ResponseEntity.ok(internshipService.updateTaskStatus(taskId, status));
    }
}

