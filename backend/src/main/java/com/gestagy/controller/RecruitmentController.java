package com.gestagy.controller;

import com.gestagy.dto.CandidateDtos;
import com.gestagy.dto.InternshipDtos;
import com.gestagy.dto.OfferDtos;
import com.gestagy.service.CandidateService;
import com.gestagy.service.InternshipService;
import com.gestagy.service.OfferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruitment")
@RequiredArgsConstructor
@Tag(name = "Recruitment & HR", description = "Gestion des offres, pipeline Kanban des candidatures et métriques")
public class RecruitmentController {

    private final OfferService offerService;
    private final CandidateService candidateService;
    private final InternshipService internshipService;

    // --- OFFRES ---
    @GetMapping("/offers")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER')")
    @Operation(summary = "Lister toutes les offres (ouvertes, brouillons, fermées)")
    public ResponseEntity<List<OfferDtos.OfferResponse>> getAllOffers() {
        return ResponseEntity.ok(offerService.getAllOffers());
    }

    @PostMapping("/offers")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER')")
    @Operation(summary = "Créer une nouvelle offre de stage")
    public ResponseEntity<OfferDtos.OfferResponse> createOffer(@RequestBody OfferDtos.OfferRequest request, Authentication auth) {
        return ResponseEntity.ok(offerService.createOffer(request, auth.getName()));
    }

    @PutMapping("/offers/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER')")
    @Operation(summary = "Modifier une offre de stage existante")
    public ResponseEntity<OfferDtos.OfferResponse> updateOffer(@PathVariable Long id, @RequestBody OfferDtos.OfferRequest request, Authentication auth) {
        return ResponseEntity.ok(offerService.updateOffer(id, request, auth.getName()));
    }

    @DeleteMapping("/offers/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR')")
    @Operation(summary = "Supprimer une offre")
    public ResponseEntity<Void> deleteOffer(@PathVariable Long id) {
        offerService.deleteOffer(id);
        return ResponseEntity.noContent().build();
    }

    // --- CANDIDATS & PIPELINE KANBAN ---
    @GetMapping("/candidates")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER')")
    @Operation(summary = "Lister tous les candidats pour le tableau Kanban")
    public ResponseEntity<List<CandidateDtos.CandidateResponse>> getAllCandidates() {
        return ResponseEntity.ok(candidateService.getAllCandidates());
    }

    @GetMapping("/offers/{offerId}/candidates")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER')")
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
        return ResponseEntity.ok(candidateService.updateStatus(id, request.getStatus(), auth.getName()));
    }

    @PatchMapping("/candidates/{id}/score")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER')")
    @Operation(summary = "Mettre à jour la note ou les remarques d'un candidat")
    public ResponseEntity<CandidateDtos.CandidateResponse> updateScore(
            @PathVariable Long id,
            @RequestBody CandidateDtos.UpdateScoreRequest request
    ) {
        return ResponseEntity.ok(candidateService.updateScore(id, request.getScore(), request.getNotes()));
    }

    // --- DASHBOARD STATS ---
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'RECRUITER')")
    @Operation(summary = "Statistiques clés du tableau de bord RH")
    public ResponseEntity<InternshipDtos.DashboardStatsResponse> getDashboardStats() {
        return ResponseEntity.ok(internshipService.getDashboardStats());
    }
}

