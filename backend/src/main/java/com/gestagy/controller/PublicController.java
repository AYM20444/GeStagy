package com.gestagy.controller;

import com.gestagy.dto.CandidateDtos;
import com.gestagy.dto.OfferDtos;
import com.gestagy.service.CandidateService;
import com.gestagy.service.OfferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
@Tag(name = "Public Portal", description = "Consultation des offres ouvertes et dépôt de candidature sans compte")
public class PublicController {

    private final OfferService offerService;
    private final CandidateService candidateService;

    @GetMapping("/offers")
    @Operation(summary = "Lister toutes les offres de stage actuellement ouvertes")
    public ResponseEntity<List<OfferDtos.OfferResponse>> getOpenOffers() {
        return ResponseEntity.ok(offerService.getPublicOffers());
    }

    @GetMapping("/offers/{id}")
    @Operation(summary = "Détail d'une offre spécifique")
    public ResponseEntity<OfferDtos.OfferResponse> getOfferById(@PathVariable Long id) {
        return ResponseEntity.ok(offerService.getOfferById(id));
    }

    @PostMapping("/offers/{id}/apply")
    @Operation(summary = "Postuler directement à une offre de stage")
    public ResponseEntity<CandidateDtos.CandidateResponse> apply(
            @PathVariable Long id,
            @RequestBody CandidateDtos.CandidateApplicationRequest request
    ) {
        request.setOfferId(id);
        return ResponseEntity.ok(candidateService.apply(request));
    }
}

