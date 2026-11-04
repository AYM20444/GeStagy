package com.gestagy.service;

import com.gestagy.dto.CandidateDtos;
import com.gestagy.model.ActivityLog;
import com.gestagy.model.Candidate;
import com.gestagy.model.InternshipOffer;
import com.gestagy.model.User;
import com.gestagy.repository.ActivityLogRepository;
import com.gestagy.repository.CandidateRepository;
import com.gestagy.repository.InternshipOfferRepository;
import com.gestagy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final InternshipOfferRepository offerRepository;
    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<CandidateDtos.CandidateResponse> getAllCandidates() {
        return candidateRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CandidateDtos.CandidateResponse> getCandidatesByOffer(Long offerId) {
        return candidateRepository.findByOfferId(offerId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CandidateDtos.CandidateResponse getCandidateById(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Candidat introuvable: " + id));
        return mapToDto(candidate);
    }

    @Transactional
    public CandidateDtos.CandidateResponse apply(CandidateDtos.CandidateApplicationRequest request) {
        InternshipOffer offer = offerRepository.findById(request.getOfferId())
                .orElseThrow(() -> new IllegalArgumentException("Offre inexistante: " + request.getOfferId()));

        Candidate candidate = Candidate.builder()
                .offer(offer)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .school(request.getSchool())
                .cvUrl(request.getCvUrl())
                .coverLetterUrl(request.getCoverLetterUrl())
                .status(Candidate.CandidateStatus.NEW)
                .score(75) // score d'initialisation
                .build();

        Candidate saved = candidateRepository.save(candidate);

        activityLogRepository.save(ActivityLog.builder()
                .action("NEW_APPLICATION")
                .entity("Candidate")
                .entityId(saved.getId())
                .details("Nouvelle candidature de " + saved.getFullName() + " pour l'offre " + offer.getTitle())
                .build());

        return mapToDto(saved);
    }

    @Transactional
    public CandidateDtos.CandidateResponse updateStatus(Long id, Candidate.CandidateStatus status, String userEmail) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Candidat introuvable: " + id));

        candidate.setStatus(status);
        Candidate saved = candidateRepository.save(candidate);

        User user = userRepository.findByEmail(userEmail).orElse(null);
        activityLogRepository.save(ActivityLog.builder()
                .user(user)
                .action("CANDIDATE_STATUS_UPDATED")
                .entity("Candidate")
                .entityId(saved.getId())
                .details("Statut mis à jour vers: " + status.name())
                .build());

        return mapToDto(saved);
    }

    @Transactional
    public CandidateDtos.CandidateResponse updateScore(Long id, Integer score, String notes) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Candidat introuvable: " + id));

        if (score != null) candidate.setScore(score);
        if (notes != null) candidate.setNotes(notes);

        Candidate saved = candidateRepository.save(candidate);
        return mapToDto(saved);
    }

    private CandidateDtos.CandidateResponse mapToDto(Candidate c) {
        return CandidateDtos.CandidateResponse.builder()
                .id(c.getId())
                .offerId(c.getOffer().getId())
                .offerTitle(c.getOffer().getTitle())
                .departmentName(c.getOffer().getDepartment() != null ? c.getOffer().getDepartment().getName() : "")
                .fullName(c.getFullName())
                .email(c.getEmail())
                .phone(c.getPhone())
                .school(c.getSchool())
                .cvUrl(c.getCvUrl())
                .coverLetterUrl(c.getCoverLetterUrl())
                .status(c.getStatus())
                .score(c.getScore())
                .notes(c.getNotes())
                .createdAt(c.getCreatedAt())
                .build();
    }
}

