package com.gestagy.service;

import com.gestagy.dto.CandidateDtos;
import com.gestagy.dto.InternshipDtos;
import com.gestagy.model.*;
import com.gestagy.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CandidateService {

    private final CandidateRepository candidateRepository;
    private final InternshipOfferRepository offerRepository;
    private final InterviewRepository interviewRepository;
    private final InternshipRepository internshipRepository;
    private final DepartmentRepository departmentRepository;
    private final DocumentRepository documentRepository;
    private final TaskRepository taskRepository;
    private final ActivityLogRepository activityLogRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final InternshipService internshipService;

    public CandidateService(
            CandidateRepository candidateRepository,
            InternshipOfferRepository offerRepository,
            InterviewRepository interviewRepository,
            InternshipRepository internshipRepository,
            DepartmentRepository departmentRepository,
            DocumentRepository documentRepository,
            TaskRepository taskRepository,
            ActivityLogRepository activityLogRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            InternshipService internshipService
    ) {
        this.candidateRepository = candidateRepository;
        this.offerRepository = offerRepository;
        this.interviewRepository = interviewRepository;
        this.internshipRepository = internshipRepository;
        this.departmentRepository = departmentRepository;
        this.documentRepository = documentRepository;
        this.taskRepository = taskRepository;
        this.activityLogRepository = activityLogRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.internshipService = internshipService;
    }

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
                .notes(request.getNotes())
                .status(Candidate.CandidateStatus.NEW)
                .score(78)
                .build();

        Candidate saved = candidateRepository.save(candidate);

        activityLogRepository.save(ActivityLog.builder()
                .action("NEW_APPLICATION")
                .entity("Candidate")
                .entityId(saved.getId())
                .details("Nouvelle candidature de " + saved.getFullName() + " (" + saved.getSchool() + ") pour " + offer.getTitle())
                .build());

        return mapToDto(saved);
    }

    @Transactional
    public CandidateDtos.CandidateResponse updateStatus(Long id, Candidate.CandidateStatus status, String userEmail) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Candidat introuvable: " + id));

        candidate.setStatus(status);
        Candidate saved = candidateRepository.save(candidate);

        User user = userEmail != null ? userRepository.findByEmail(userEmail).orElse(null) : null;
        activityLogRepository.save(ActivityLog.builder()
                .user(user)
                .action("CANDIDATE_STATUS_UPDATED")
                .entity("Candidate")
                .entityId(saved.getId())
                .details("Statut de " + saved.getFullName() + " passé à " + status.name())
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

    // --- INTERVIEWS ---
    @Transactional(readOnly = true)
    public List<CandidateDtos.InterviewResponse> getAllInterviews() {
        return interviewRepository.findAll().stream()
                .sorted(Comparator.comparing(Interview::getScheduledAt))
                .map(this::mapInterviewToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<CandidateDtos.InterviewResponse> getInterviewsByCandidate(Long candidateId) {
        return interviewRepository.findByCandidateId(candidateId).stream()
                .sorted(Comparator.comparing(Interview::getScheduledAt))
                .map(this::mapInterviewToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public CandidateDtos.InterviewResponse scheduleInterview(Long candidateId, CandidateDtos.InterviewRequest request, String userEmail) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new IllegalArgumentException("Candidat introuvable: " + candidateId));

        User interviewer = null;
        if (request.getInterviewerId() != null) {
            interviewer = userRepository.findById(request.getInterviewerId()).orElse(null);
        }
        if (interviewer == null && userEmail != null) {
            interviewer = userRepository.findByEmail(userEmail).orElse(null);
        }
        if (interviewer == null) {
            interviewer = userRepository.findAll().stream().findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Aucun intervieweur disponible"));
        }

        Interview interview = Interview.builder()
                .candidate(candidate)
                .interviewer(interviewer)
                .scheduledAt(request.getScheduledAt() != null ? request.getScheduledAt() : LocalDateTime.now().plusDays(2))
                .type(request.getType() != null ? request.getType() : Interview.InterviewType.VIDEO)
                .feedback(request.getFeedback())
                .rating(request.getRating())
                .build();

        Interview saved = interviewRepository.save(interview);

        // Automatically move candidate to INTERVIEW if in NEW or SCREENING
        if (candidate.getStatus() == Candidate.CandidateStatus.NEW || candidate.getStatus() == Candidate.CandidateStatus.SCREENING) {
            candidate.setStatus(Candidate.CandidateStatus.INTERVIEW);
            candidateRepository.save(candidate);
        }

        activityLogRepository.save(ActivityLog.builder()
                .user(interviewer)
                .action("INTERVIEW_SCHEDULED")
                .entity("Interview")
                .entityId(saved.getId())
                .details("Entretien " + saved.getType().name() + " planifié avec " + candidate.getFullName())
                .build());

        return mapInterviewToDto(saved);
    }

    @Transactional
    public CandidateDtos.InterviewResponse updateInterviewFeedback(Long interviewId, CandidateDtos.InterviewFeedbackRequest request) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new IllegalArgumentException("Entretien introuvable: " + interviewId));

        if (request.getFeedback() != null) interview.setFeedback(request.getFeedback());
        if (request.getRating() != null) interview.setRating(request.getRating());

        Interview saved = interviewRepository.save(interview);
        return mapInterviewToDto(saved);
    }

    // --- CONVERT ACCEPTED CANDIDATE TO INTERN & CREATE INTERNSHIP ---
    @Transactional
    public InternshipDtos.InternshipResponse convertCandidateToIntern(Long candidateId, CandidateDtos.ConvertToInternRequest request, String actorEmail) {
        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new IllegalArgumentException("Candidat introuvable: " + candidateId));

        candidate.setStatus(Candidate.CandidateStatus.ACCEPTED);
        candidateRepository.save(candidate);

        // 1. Find or create Intern User account
        User internUser = userRepository.findByEmail(candidate.getEmail()).orElseGet(() -> {
            User newUser = User.builder()
                    .email(candidate.getEmail())
                    .password(passwordEncoder.encode("password123"))
                    .active(true)
                    .build();
            Profile profile = Profile.builder()
                    .user(newUser)
                    .fullName(candidate.getFullName())
                    .phone(candidate.getPhone())
                    .school(candidate.getSchool())
                    .fieldOfStudy(candidate.getOffer().getTitle())
                    .level("Bac+5 / Master")
                    .build();
            newUser.setProfile(profile);
            newUser.addRole(RoleName.INTERN);
            return userRepository.save(newUser);
        });
        internUser.addRole(RoleName.INTERN);

        // 2. Resolve Tutor & Department
        User tutor = null;
        if (request.getTutorId() != null) {
            tutor = userRepository.findById(request.getTutorId()).orElse(null);
        }
        if (tutor == null) {
            tutor = userRepository.findAll().stream()
                    .filter(u -> u.getRoles().stream().anyMatch(r -> r.getRole() == RoleName.TUTOR))
                    .findFirst()
                    .orElseGet(() -> userRepository.findAll().stream().findFirst().orElseThrow());
        }

        Department dept = candidate.getOffer().getDepartment();
        if (request.getDepartmentId() != null) {
            dept = departmentRepository.findById(request.getDepartmentId()).orElse(dept);
        }

        LocalDate start = request.getStartDate() != null ? request.getStartDate() : LocalDate.now();
        int months = candidate.getOffer().getDurationMonths() != null ? candidate.getOffer().getDurationMonths() : 6;
        LocalDate end = request.getEndDate() != null ? request.getEndDate() : start.plusMonths(months);
        String topic = (request.getTopic() != null && !request.getTopic().isBlank())
                ? request.getTopic()
                : candidate.getOffer().getTitle();

        Internship internship = Internship.builder()
                .intern(internUser)
                .tutor(tutor)
                .department(dept)
                .startDate(start)
                .endDate(end)
                .topic(topic)
                .status(Internship.InternshipStatus.ONGOING)
                .build();

        Internship savedInternship = internshipRepository.save(internship);

        // 3. Create initial Convention Document
        documentRepository.save(Document.builder()
                .internship(savedInternship)
                .type(Document.DocumentType.CONVENTION)
                .fileName("Convention_Stage_" + candidate.getFullName().replaceAll("\\s+", "_") + ".pdf")
                .fileUrl("/api/internships/" + savedInternship.getId() + "/attestation/pdf")
                .uploadedBy(tutor)
                .signed(false)
                .build());

        // 4. Create initial onboarding tasks
        taskRepository.save(Task.builder()
                .internship(savedInternship)
                .title("Onboarding & Configuration de l'environnement")
                .description("Prendre connaissance de l'équipe, configurer les accès et valider la convention de stage.")
                .dueDate(LocalDate.now().plusWeeks(1))
                .status(Task.TaskStatus.IN_PROGRESS)
                .assignedBy(tutor)
                .build());

        taskRepository.save(Task.builder()
                .internship(savedInternship)
                .title("Analyse de l'architecture et cadrage du sujet")
                .description("Rédiger le document de cadrage technique pour : " + topic)
                .dueDate(LocalDate.now().plusWeeks(3))
                .status(Task.TaskStatus.TODO)
                .assignedBy(tutor)
                .build());

        User actor = actorEmail != null ? userRepository.findByEmail(actorEmail).orElse(tutor) : tutor;
        activityLogRepository.save(ActivityLog.builder()
                .user(actor)
                .action("INTERNSHIP_CREATED")
                .entity("Internship")
                .entityId(savedInternship.getId())
                .details("Conversion de " + candidate.getFullName() + " en stagiaire actif (Encadrant : "
                        + (tutor.getProfile() != null ? tutor.getProfile().getFullName() : tutor.getEmail()) + ")")
                .build());

        return internshipService.getInternshipById(savedInternship.getId());
    }

    private CandidateDtos.CandidateResponse mapToDto(Candidate c) {
        List<Interview> interviews = interviewRepository.findByCandidateId(c.getId());
        LocalDateTime nextInterview = interviews.stream()
                .map(Interview::getScheduledAt)
                .filter(d -> d != null && d.isAfter(LocalDateTime.now().minusDays(1)))
                .sorted()
                .findFirst()
                .orElse(null);

        return CandidateDtos.CandidateResponse.builder()
                .id(c.getId())
                .offerId(c.getOffer().getId())
                .offerTitle(c.getOffer().getTitle())
                .departmentId(c.getOffer().getDepartment() != null ? c.getOffer().getDepartment().getId() : null)
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
                .interviewsCount(interviews.size())
                .nextInterviewAt(nextInterview)
                .createdAt(c.getCreatedAt())
                .build();
    }

    private CandidateDtos.InterviewResponse mapInterviewToDto(Interview i) {
        String interviewerName = i.getInterviewer().getProfile() != null
                ? i.getInterviewer().getProfile().getFullName()
                : i.getInterviewer().getEmail();
        return CandidateDtos.InterviewResponse.builder()
                .id(i.getId())
                .candidateId(i.getCandidate().getId())
                .candidateName(i.getCandidate().getFullName())
                .candidateEmail(i.getCandidate().getEmail())
                .candidateSchool(i.getCandidate().getSchool())
                .offerTitle(i.getCandidate().getOffer().getTitle())
                .interviewerId(i.getInterviewer().getId())
                .interviewerName(interviewerName)
                .scheduledAt(i.getScheduledAt())
                .type(i.getType())
                .feedback(i.getFeedback())
                .rating(i.getRating())
                .createdAt(i.getCreatedAt())
                .build();
    }
}
