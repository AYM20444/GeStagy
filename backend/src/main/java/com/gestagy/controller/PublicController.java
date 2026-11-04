package com.gestagy.controller;

import com.gestagy.dto.CandidateDtos;
import com.gestagy.dto.OfferDtos;
import com.gestagy.service.CandidateService;
import com.gestagy.service.FileStorageService;
import com.gestagy.service.OfferService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@Tag(name = "Public Portal", description = "Consultation des offres ouvertes, départements et dépôt de candidature avec upload CV")
public class PublicController {

    private final OfferService offerService;
    private final CandidateService candidateService;
    private final FileStorageService fileStorageService;

    public PublicController(OfferService offerService, CandidateService candidateService, FileStorageService fileStorageService) {
        this.offerService = offerService;
        this.candidateService = candidateService;
        this.fileStorageService = fileStorageService;
    }

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

    @GetMapping("/departments")
    @Operation(summary = "Lister tous les départements de l'entreprise")
    public ResponseEntity<List<OfferDtos.DepartmentResponse>> getDepartments() {
        return ResponseEntity.ok(offerService.getAllDepartments());
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

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Téléverser un fichier CV ou Lettre de motivation (PDF)")
    public ResponseEntity<Map<String, String>> uploadPublicFile(@RequestParam("file") MultipartFile file) {
        String fileUrl = fileStorageService.storeFile(file);
        return ResponseEntity.ok(Map.of(
                "fileName", file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.pdf",
                "fileUrl", fileUrl
        ));
    }
}
