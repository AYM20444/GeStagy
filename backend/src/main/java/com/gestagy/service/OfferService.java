package com.gestagy.service;

import com.gestagy.dto.OfferDtos;
import com.gestagy.model.ActivityLog;
import com.gestagy.model.Department;
import com.gestagy.model.InternshipOffer;
import com.gestagy.model.User;
import com.gestagy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final InternshipOfferRepository offerRepository;
    private final DepartmentRepository departmentRepository;
    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;

    @Transactional(readOnly = true)
    public List<OfferDtos.OfferResponse> getPublicOffers() {
        return offerRepository.findByStatus(InternshipOffer.OfferStatus.OPEN).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OfferDtos.OfferResponse> getAllOffers() {
        return offerRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OfferDtos.OfferResponse getOfferById(Long id) {
        InternshipOffer offer = offerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Offre non trouvée: " + id));
        return mapToDto(offer);
    }

    @Transactional
    public OfferDtos.OfferResponse createOffer(OfferDtos.OfferRequest request, String userEmail) {
        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Département non trouvé"));

        User user = userRepository.findByEmail(userEmail).orElse(null);

        InternshipOffer offer = InternshipOffer.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .department(department)
                .skills(request.getSkills())
                .durationMonths(request.getDurationMonths())
                .startDate(request.getStartDate())
                .location(request.getLocation())
                .status(request.getStatus() != null ? request.getStatus() : InternshipOffer.OfferStatus.OPEN)
                .createdBy(user)
                .build();

        InternshipOffer saved = offerRepository.save(offer);

        activityLogRepository.save(ActivityLog.builder()
                .user(user)
                .action("OFFER_CREATED")
                .entity("InternshipOffer")
                .entityId(saved.getId())
                .details("Création de l'offre: " + saved.getTitle())
                .build());

        return mapToDto(saved);
    }

    @Transactional
    public OfferDtos.OfferResponse updateOffer(Long id, OfferDtos.OfferRequest request, String userEmail) {
        InternshipOffer offer = offerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Offre introuvable: " + id));

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new IllegalArgumentException("Département introuvable"));

        offer.setTitle(request.getTitle());
        offer.setDescription(request.getDescription());
        offer.setDepartment(department);
        offer.setSkills(request.getSkills());
        offer.setDurationMonths(request.getDurationMonths());
        offer.setStartDate(request.getStartDate());
        offer.setLocation(request.getLocation());
        if (request.getStatus() != null) {
            offer.setStatus(request.getStatus());
        }

        InternshipOffer saved = offerRepository.save(offer);

        User user = userRepository.findByEmail(userEmail).orElse(null);
        activityLogRepository.save(ActivityLog.builder()
                .user(user)
                .action("OFFER_UPDATED")
                .entity("InternshipOffer")
                .entityId(saved.getId())
                .details("Mise à jour de l'offre: " + saved.getTitle())
                .build());

        return mapToDto(saved);
    }

    @Transactional
    public void deleteOffer(Long id) {
        offerRepository.deleteById(id);
    }

    private OfferDtos.OfferResponse mapToDto(InternshipOffer offer) {
        long candidatesCount = candidateRepository.findByOfferId(offer.getId()).size();

        return OfferDtos.OfferResponse.builder()
                .id(offer.getId())
                .title(offer.getTitle())
                .description(offer.getDescription())
                .departmentId(offer.getDepartment().getId())
                .departmentName(offer.getDepartment().getName())
                .skills(offer.getSkills())
                .durationMonths(offer.getDurationMonths())
                .startDate(offer.getStartDate())
                .location(offer.getLocation())
                .status(offer.getStatus())
                .candidatesCount(candidatesCount)
                .createdAt(offer.getCreatedAt())
                .build();
    }
}

