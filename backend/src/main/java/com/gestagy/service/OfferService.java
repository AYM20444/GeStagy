package com.gestagy.service;

import com.gestagy.dto.OfferDtos;
import com.gestagy.model.ActivityLog;
import com.gestagy.model.Department;
import com.gestagy.model.InternshipOffer;
import com.gestagy.model.User;
import com.gestagy.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OfferService {

    private final InternshipOfferRepository offerRepository;
    private final DepartmentRepository departmentRepository;
    private final CandidateRepository candidateRepository;
    private final InternshipRepository internshipRepository;
    private final UserRepository userRepository;
    private final ActivityLogRepository activityLogRepository;

    public OfferService(
            InternshipOfferRepository offerRepository,
            DepartmentRepository departmentRepository,
            CandidateRepository candidateRepository,
            InternshipRepository internshipRepository,
            UserRepository userRepository,
            ActivityLogRepository activityLogRepository
    ) {
        this.offerRepository = offerRepository;
        this.departmentRepository = departmentRepository;
        this.candidateRepository = candidateRepository;
        this.internshipRepository = internshipRepository;
        this.userRepository = userRepository;
        this.activityLogRepository = activityLogRepository;
    }

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

        User user = userEmail != null ? userRepository.findByEmail(userEmail).orElse(null) : null;

        InternshipOffer offer = InternshipOffer.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .department(department)
                .skills(request.getSkills())
                .durationMonths(request.getDurationMonths() != null ? request.getDurationMonths() : 6)
                .startDate(request.getStartDate())
                .location(request.getLocation() != null ? request.getLocation() : "Casablanca / Hybride")
                .status(request.getStatus() != null ? request.getStatus() : InternshipOffer.OfferStatus.OPEN)
                .createdBy(user)
                .build();

        InternshipOffer saved = offerRepository.save(offer);

        activityLogRepository.save(ActivityLog.builder()
                .user(user)
                .action("OFFER_CREATED")
                .entity("InternshipOffer")
                .entityId(saved.getId())
                .details("Création de l'offre : " + saved.getTitle())
                .build());

        return mapToDto(saved);
    }

    @Transactional
    public OfferDtos.OfferResponse updateOffer(Long id, OfferDtos.OfferRequest request, String userEmail) {
        InternshipOffer offer = offerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Offre introuvable: " + id));

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Département introuvable"));
            offer.setDepartment(department);
        }

        if (request.getTitle() != null) offer.setTitle(request.getTitle());
        if (request.getDescription() != null) offer.setDescription(request.getDescription());
        if (request.getSkills() != null) offer.setSkills(request.getSkills());
        if (request.getDurationMonths() != null) offer.setDurationMonths(request.getDurationMonths());
        if (request.getStartDate() != null) offer.setStartDate(request.getStartDate());
        if (request.getLocation() != null) offer.setLocation(request.getLocation());
        if (request.getStatus() != null) offer.setStatus(request.getStatus());

        InternshipOffer saved = offerRepository.save(offer);

        User user = userEmail != null ? userRepository.findByEmail(userEmail).orElse(null) : null;
        activityLogRepository.save(ActivityLog.builder()
                .user(user)
                .action("OFFER_UPDATED")
                .entity("InternshipOffer")
                .entityId(saved.getId())
                .details("Mise à jour de l'offre : " + saved.getTitle() + " (" + saved.getStatus() + ")")
                .build());

        return mapToDto(saved);
    }

    @Transactional
    public void deleteOffer(Long id) {
        offerRepository.deleteById(id);
    }

    // --- DEPARTMENTS ---
    @Transactional(readOnly = true)
    public List<OfferDtos.DepartmentResponse> getAllDepartments() {
        List<InternshipOffer> allOffers = offerRepository.findAll();
        return departmentRepository.findAll().stream()
                .map(d -> {
                    long offersCount = allOffers.stream()
                            .filter(o -> o.getDepartment() != null && o.getDepartment().getId().equals(d.getId()))
                            .count();
                    long internshipsCount = internshipRepository.findByDepartmentId(d.getId()).size();
                    return OfferDtos.DepartmentResponse.builder()
                            .id(d.getId())
                            .name(d.getName())
                            .description(d.getDescription())
                            .offersCount(offersCount)
                            .internshipsCount(internshipsCount)
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public OfferDtos.DepartmentResponse createDepartment(OfferDtos.DepartmentRequest request) {
        Department d = Department.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        Department saved = departmentRepository.save(d);
        return OfferDtos.DepartmentResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .description(saved.getDescription())
                .offersCount(0)
                .internshipsCount(0)
                .build();
    }

    @Transactional
    public OfferDtos.DepartmentResponse updateDepartment(Long id, OfferDtos.DepartmentRequest request) {
        Department d = departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Département introuvable: " + id));
        if (request.getName() != null) d.setName(request.getName());
        if (request.getDescription() != null) d.setDescription(request.getDescription());
        Department saved = departmentRepository.save(d);
        return OfferDtos.DepartmentResponse.builder()
                .id(saved.getId())
                .name(saved.getName())
                .description(saved.getDescription())
                .offersCount(0)
                .internshipsCount(internshipRepository.findByDepartmentId(saved.getId()).size())
                .build();
    }

    private OfferDtos.OfferResponse mapToDto(InternshipOffer offer) {
        long candidatesCount = candidateRepository.findByOfferId(offer.getId()).size();
        String createdByName = "";
        if (offer.getCreatedBy() != null) {
            createdByName = offer.getCreatedBy().getProfile() != null
                    ? offer.getCreatedBy().getProfile().getFullName()
                    : offer.getCreatedBy().getEmail();
        }

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
                .createdByName(createdByName)
                .createdAt(offer.getCreatedAt())
                .build();
    }
}
