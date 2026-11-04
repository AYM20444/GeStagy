package com.gestagy.controller;

import com.gestagy.dto.AuthDtos;
import com.gestagy.dto.CandidateDtos;
import com.gestagy.dto.InternshipDtos;
import com.gestagy.dto.OfferDtos;
import com.gestagy.model.RoleName;
import com.gestagy.service.AuthService;
import com.gestagy.service.CandidateService;
import com.gestagy.service.InternshipService;
import com.gestagy.service.OfferService;
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
@RequestMapping("/api/recruitment")
@Tag(name = "Recruitment & HR", description = "Gestion des offres, pipeline Kanban, entretiens, conversion stagiaire et rapports CSV")
public class RecruitmentController {

    private final OfferService offerService;
    private final CandidateService candidateService;
    private final InternshipService internshipService;
    private final AuthService authService;

    public RecruitmentController(
            OfferService offerService,
            CandidateService candidateService,
            InternshipService internshipService,
            AuthService authService
    ) {
        this.offerService = offerService;
        this.candidateService = candidateService;
        this.internshipService = internshipService;
        this.authService = authService;
    }

    // --- OFFRES ---
    @GetMapping("/offers")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER', 'TUTOR')")
    @Operation(summary = "Lister toutes les offres (ouvertes, brouillons, fermées)")
    public ResponseEntity<List<OfferDtos.OfferResponse>> getAllOffers() {
        return ResponseEntity.ok(offerService.getAllOffers());
    }

    @PostMapping("/offers")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER')")
    @Operation(summary = "Créer une nouvelle offre de stage")
    public ResponseEntity<OfferDtos.OfferResponse> createOffer(@RequestBody OfferDtos.OfferRequest request, Authentication auth) {
        return ResponseEntity.ok(offerService.createOffer(request, auth != null ? auth.getName() : null));
    }

    @PutMapping("/offers/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER')")
    @Operation(summary = "Modifier une offre de stage existante")
    public ResponseEntity<OfferDtos.OfferResponse> updateOffer(@PathVariable Long id, @RequestBody OfferDtos.OfferRequest request, Authentication auth) {
        return ResponseEntity.ok(offerService.updateOffer(id, request, auth != null ? auth.getName() : null));
    }

    @DeleteMapping("/offers/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER')")
    @Operation(summary = "Supprimer une offre")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long id) {
        offerService.deleteOffer(id);
        return ResponseEntity.noContent().build();
    }

    // --- CANDIDATS & PIPELINE KANBAN ---
    @GetMapping("/candidates")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER', 'TUTOR')")
    @Operation(summary = "Lister tous les candidats pour le tableau Kanban")
    public ResponseEntity<List<CandidateDtos.CandidateResponse>> getAllCandidates() {
        return ResponseEntity.ok(candidateService.getAllCandidates());
    }

    @GetMapping("/offers/{offerId}/candidates")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER', 'TUTOR')")
    @Operation(summary = "Lister les candidats par offre spécifique")
    public ResponseEntity<List<CandidateDtos.CandidateResponse>> getCandidatesByOffer(@PathVariable Long offerId) {
        return ResponseEntity.ok(candidateService.getCandidatesByOffer(offerId));
    }

    @PatchMapping("/candidates/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER')")
    @Operation(summary = "Mettre à jour le statut d'un candidat (drag & drop Kanban)")
    public ResponseEntity<CandidateDtos.CandidateResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody CandidateDtos.UpdateStatusRequest request,
            Authentication auth
    ) {
        return ResponseEntity.ok(candidateService.updateStatus(id, request.getStatus(), auth != null ? auth.getName() : null));
    }

    @PatchMapping("/candidates/{id}/score")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER', 'TUTOR')")
    @Operation(summary = "Mettre à jour la note ou les remarques d'un candidat")
    public ResponseEntity<CandidateDtos.CandidateResponse> updateScore(
            @PathVariable Long id,
            @RequestBody CandidateDtos.UpdateScoreRequest request
    ) {
        return ResponseEntity.ok(candidateService.updateScore(id, request.getScore(), request.getNotes()));
    }

    @PostMapping("/candidates/{id}/convert")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER')")
    @Operation(summary = "Convertir un candidat accepté en Stagiaire actif avec création du stage et convention")
    public ResponseEntity<InternshipDtos.InternshipResponse> convertToIntern(
            @PathVariable Long id,
            @RequestBody CandidateDtos.ConvertToInternRequest request,
            Authentication auth
    ) {
        return ResponseEntity.ok(candidateService.convertCandidateToIntern(id, request, auth != null ? auth.getName() : null));
    }

    // --- ENTRETIENS (INTERVIEWS) ---
    @GetMapping("/interviews")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER', 'TUTOR')")
    @Operation(summary = "Lister tous les entretiens planifiés")
    public ResponseEntity<List<CandidateDtos.InterviewResponse>> getAllInterviews() {
        return ResponseEntity.ok(candidateService.getAllInterviews());
    }

    @GetMapping("/candidates/{candidateId}/interviews")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER', 'TUTOR')")
    @Operation(summary = "Lister les entretiens d'un candidat spécifique")
    public ResponseEntity<List<CandidateDtos.InterviewResponse>> getCandidateInterviews(@PathVariable Long candidateId) {
        return ResponseEntity.ok(candidateService.getInterviewsByCandidate(candidateId));
    }

    @PostMapping("/candidates/{candidateId}/interviews")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER', 'TUTOR')")
    @Operation(summary = "Planifier un entretien pour un candidat")
    public ResponseEntity<CandidateDtos.InterviewResponse> scheduleInterview(
            @PathVariable Long candidateId,
            @RequestBody CandidateDtos.InterviewRequest request,
            Authentication auth
    ) {
        return ResponseEntity.ok(candidateService.scheduleInterview(candidateId, request, auth != null ? auth.getName() : null));
    }

    @PatchMapping("/interviews/{interviewId}/feedback")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER', 'TUTOR')")
    @Operation(summary = "Enregistrer le compte-rendu (feedback) et la note d'un entretien")
    public ResponseEntity<CandidateDtos.InterviewResponse> saveInterviewFeedback(
            @PathVariable Long interviewId,
            @RequestBody CandidateDtos.InterviewFeedbackRequest request
    ) {
        return ResponseEntity.ok(candidateService.updateInterviewFeedback(interviewId, request));
    }

    // --- TUTEURS & DEPARTEMENTS DISPONIBLES ---
    @GetMapping("/tutors")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER', 'TUTOR')")
    @Operation(summary = "Lister les encadrants/tuteurs disponibles")
    public ResponseEntity<List<AuthDtos.UserProfileResponse>> getTutors() {
        return ResponseEntity.ok(authService.getUsersByRole(RoleName.TUTOR));
    }

    // --- DASHBOARD STATS & EXPORT CSV ---
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER', 'TUTOR')")
    @Operation(summary = "Statistiques clés du tableau de bord RH et journal d'activité")
    public ResponseEntity<InternshipDtos.DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(internshipService.getDashboardStats());
    }

    @GetMapping("/reports/export.csv")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER')")
    @Operation(summary = "Exporter le rapport complet des candidatures et stages en CSV (compatible Excel)")
    public ResponseEntity<byte[]> exportCsvReport() {
        byte[] csvBytes = internshipService.exportRecruitmentReportCsv();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"GeStagy_Rapport_RH_2026.csv\"")
                .contentType(MediaType.parseMediaType("text/csv; charset=UTF-8"))
                .body(csvBytes);
    }
}
