package com.gestagy.controller;

import com.gestagy.dto.InternshipDtos;
import com.gestagy.model.Evaluation;
import com.gestagy.model.Internship;
import com.gestagy.model.Task;
import com.gestagy.service.InternshipService;
import com.gestagy.service.PdfGeneratorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/internships")
@Tag(name = "Internships, Tasks, Evaluations & Documents", description = "Suivi de stage, Kanban tâches, évaluations, documents et génération PDF")
public class InternshipController {

    private final InternshipService internshipService;
    private final PdfGeneratorService pdfGeneratorService;

    public InternshipController(InternshipService internshipService, PdfGeneratorService pdfGeneratorService) {
        this.internshipService = internshipService;
        this.pdfGeneratorService = pdfGeneratorService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER', 'TUTOR', 'INTERN')")
    @Operation(summary = "Lister tous les stages")
    public ResponseEntity<List<InternshipDtos.InternshipResponse>> getAllInternships() {
        return ResponseEntity.ok(internshipService.getAllInternships());
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER', 'TUTOR', 'INTERN')")
    @Operation(summary = "Lister les stages associés à l'utilisateur connecté (Stagiaire ou Tuteur)")
    public ResponseEntity<List<InternshipDtos.InternshipResponse>> getMyInternships(Authentication auth) {
        return ResponseEntity.ok(internshipService.getInternshipsForUser(auth != null ? auth.getName() : null));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER', 'TUTOR', 'INTERN')")
    @Operation(summary = "Obtenir les détails complets d'un stage")
    public ResponseEntity<InternshipDtos.InternshipResponse> getInternshipById(@PathVariable Long id) {
        return ResponseEntity.ok(internshipService.getInternshipById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'TUTOR')")
    @Operation(summary = "Mettre à jour un stage (assigner un tuteur, modifier dates ou statut)")
    public ResponseEntity<InternshipDtos.InternshipResponse> updateInternship(
            @PathVariable Long id,
            @RequestBody InternshipDtos.InternshipUpdateRequest request,
            Authentication auth
    ) {
        return ResponseEntity.ok(internshipService.updateInternship(id, request, auth != null ? auth.getName() : null));
    }

    // --- TÂCHES ---
    @GetMapping("/{id}/tasks")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER', 'TUTOR', 'INTERN')")
    @Operation(summary = "Lister les tâches associées à un stage")
    public ResponseEntity<List<InternshipDtos.TaskResponse>> getTasks(@PathVariable Long id) {
        return ResponseEntity.ok(internshipService.getTasksByInternship(id));
    }

    @PostMapping("/{id}/tasks")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'TUTOR', 'INTERN')")
    @Operation(summary = "Créer une nouvelle tâche pour un stagiaire")
    public ResponseEntity<InternshipDtos.TaskResponse> createTask(
            @PathVariable Long id,
            @RequestBody InternshipDtos.TaskRequest request,
            Authentication auth
    ) {
        return ResponseEntity.ok(internshipService.createTask(id, request, auth != null ? auth.getName() : null));
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

    @DeleteMapping("/tasks/{taskId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'TUTOR')")
    @Operation(summary = "Supprimer une tâche")
    public ResponseEntity<Void> deleteTask(@PathVariable Long taskId) {
        internshipService.deleteTask(taskId);
        return ResponseEntity.noContent().build();
    }

    // --- ÉVALUATIONS ---
    @GetMapping("/{id}/evaluations")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER', 'TUTOR', 'INTERN')")
    @Operation(summary = "Lister les évaluations d'un stage (mi-parcours et finale)")
    public ResponseEntity<List<InternshipDtos.EvaluationResponse>> getEvaluations(@PathVariable Long id) {
        return ResponseEntity.ok(internshipService.getEvaluationsByInternship(id));
    }

    @PostMapping("/{id}/evaluations")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'TUTOR')")
    @Operation(summary = "Enregistrer une évaluation (MID_TERM ou FINAL) pour un stage")
    public ResponseEntity<InternshipDtos.EvaluationResponse> createEvaluation(
            @PathVariable Long id,
            @RequestBody InternshipDtos.EvaluationRequest request,
            Authentication auth
    ) {
        return ResponseEntity.ok(internshipService.createEvaluation(id, request, auth != null ? auth.getName() : null));
    }

    @GetMapping("/evaluations/{evalId}/pdf")
    @Operation(summary = "Exporter une fiche d'évaluation en PDF officiel")
    public ResponseEntity<byte[]> downloadEvaluationPdf(@PathVariable Long evalId) {
        Evaluation eval = internshipService.getEvaluationEntity(evalId);
        byte[] pdfBytes = pdfGeneratorService.generateEvaluationPdf(eval);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Evaluation_Stage_" + evalId + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    // --- DOCUMENTS & ATTESTATION PDF ---
    @GetMapping("/{id}/documents")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER', 'TUTOR', 'INTERN')")
    @Operation(summary = "Lister les documents associés à un stage")
    public ResponseEntity<List<InternshipDtos.DocumentResponse>> getDocuments(@PathVariable Long id) {
        return ResponseEntity.ok(internshipService.getDocumentsByInternship(id));
    }

    @PostMapping("/{id}/documents")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'TUTOR', 'INTERN')")
    @Operation(summary = "Ajouter un document (Convention, Rapport, Attestation) à un stage")
    public ResponseEntity<InternshipDtos.DocumentResponse> addDocument(
            @PathVariable Long id,
            @RequestBody InternshipDtos.DocumentRequest request,
            Authentication auth
    ) {
        return ResponseEntity.ok(internshipService.createDocument(id, request, auth != null ? auth.getName() : null));
    }

    @PatchMapping("/documents/{docId}/sign")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'TUTOR', 'INTERN')")
    @Operation(summary = "Basculer le statut de signature d'un document")
    public ResponseEntity<InternshipDtos.DocumentResponse> toggleDocumentSignature(
            @PathVariable Long docId,
            Authentication auth
    ) {
        return ResponseEntity.ok(internshipService.toggleDocumentSignature(docId, auth != null ? auth.getName() : null));
    }

    @GetMapping("/{id}/attestation/pdf")
    @Operation(summary = "Générer et télécharger l'Attestation de Stage officielle en PDF")
    public ResponseEntity<byte[]> downloadAttestationPdf(@PathVariable Long id) {
        Internship internship = internshipService.getInternshipEntity(id);
        byte[] pdfBytes = pdfGeneratorService.generateInternshipAttestationPdf(internship);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"Attestation_Stage_GeStagy_" + id + ".pdf\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    // --- NOTIFICATIONS ---
    @GetMapping("/notifications/all")
    @Operation(summary = "Récupérer les notifications et rappels actifs")
    public ResponseEntity<List<InternshipDtos.NotificationResponse>> getNotifications() {
        return ResponseEntity.ok(internshipService.getNotifications());
    }
}
