package com.gestagy.service;

import com.gestagy.dto.InternshipDtos;
import com.gestagy.model.*;
import com.gestagy.repository.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InternshipService {

    private final InternshipRepository internshipRepository;
    private final TaskRepository taskRepository;
    private final EvaluationRepository evaluationRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final InternshipOfferRepository offerRepository;
    private final CandidateRepository candidateRepository;
    private final InterviewRepository interviewRepository;
    private final ActivityLogRepository activityLogRepository;

    public InternshipService(
            InternshipRepository internshipRepository,
            TaskRepository taskRepository,
            EvaluationRepository evaluationRepository,
            DocumentRepository documentRepository,
            UserRepository userRepository,
            DepartmentRepository departmentRepository,
            InternshipOfferRepository offerRepository,
            CandidateRepository candidateRepository,
            InterviewRepository interviewRepository,
            ActivityLogRepository activityLogRepository
    ) {
        this.internshipRepository = internshipRepository;
        this.taskRepository = taskRepository;
        this.evaluationRepository = evaluationRepository;
        this.documentRepository = documentRepository;
        this.userRepository = userRepository;
        this.departmentRepository = departmentRepository;
        this.offerRepository = offerRepository;
        this.candidateRepository = candidateRepository;
        this.interviewRepository = interviewRepository;
        this.activityLogRepository = activityLogRepository;
    }

    @Transactional(readOnly = true)
    public List<InternshipDtos.InternshipResponse> getAllInternships() {
        return internshipRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InternshipDtos.InternshipResponse> getInternshipsForUser(String email) {
        if (email == null) return getAllInternships();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return getAllInternships();

        boolean isAdminOrHr = user.getRoles().stream()
                .anyMatch(r -> r.getRole() == RoleName.ADMIN || r.getRole() == RoleName.HR || r.getRole() == RoleName.RECRUITER);
        if (isAdminOrHr) {
            return getAllInternships();
        }

        boolean isTutor = user.getRoles().stream().anyMatch(r -> r.getRole() == RoleName.TUTOR);
        if (isTutor) {
            List<Internship> tutorList = internshipRepository.findByTutorId(user.getId());
            if (!tutorList.isEmpty()) {
                return tutorList.stream().map(this::mapToDto).collect(Collectors.toList());
            }
        }

        List<Internship> internList = internshipRepository.findByInternId(user.getId());
        if (!internList.isEmpty()) {
            return internList.stream().map(this::mapToDto).collect(Collectors.toList());
        }

        return getAllInternships();
    }

    @Transactional(readOnly = true)
    public InternshipDtos.InternshipResponse getInternshipById(Long id) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Stage non trouvé: " + id));
        return mapToDto(internship);
    }

    @Transactional(readOnly = true)
    public Internship getInternshipEntity(Long id) {
        return internshipRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Stage non trouvé: " + id));
    }

    @Transactional
    public InternshipDtos.InternshipResponse updateInternship(Long id, InternshipDtos.InternshipUpdateRequest request, String actorEmail) {
        Internship internship = getInternshipEntity(id);
        if (request.getTutorId() != null) {
            User tutor = userRepository.findById(request.getTutorId())
                    .orElseThrow(() -> new IllegalArgumentException("Tuteur introuvable"));
            internship.setTutor(tutor);
        }
        if (request.getDepartmentId() != null) {
            Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Département introuvable"));
            internship.setDepartment(dept);
        }
        if (request.getStartDate() != null) internship.setStartDate(request.getStartDate());
        if (request.getEndDate() != null) internship.setEndDate(request.getEndDate());
        if (request.getTopic() != null) internship.setTopic(request.getTopic());
        if (request.getStatus() != null) internship.setStatus(request.getStatus());

        Internship saved = internshipRepository.save(internship);
        return mapToDto(saved);
    }

    // --- TASKS ---
    @Transactional(readOnly = true)
    public List<InternshipDtos.TaskResponse> getTasksByInternship(Long internshipId) {
        return taskRepository.findByInternshipId(internshipId).stream()
                .map(this::mapTaskToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public InternshipDtos.TaskResponse createTask(Long internshipId, InternshipDtos.TaskRequest request, String userEmail) {
        Internship internship = getInternshipEntity(internshipId);
        User user = userEmail != null ? userRepository.findByEmail(userEmail).orElse(internship.getTutor()) : internship.getTutor();

        Task task = Task.builder()
                .internship(internship)
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate() != null ? request.getDueDate() : LocalDate.now().plusWeeks(2))
                .status(request.getStatus() != null ? request.getStatus() : Task.TaskStatus.TODO)
                .assignedBy(user)
                .build();

        Task saved = taskRepository.save(task);

        activityLogRepository.save(ActivityLog.builder()
                .user(user)
                .action("TASK_CREATED")
                .entity("Task")
                .entityId(saved.getId())
                .details("Nouvelle tâche assignée : " + saved.getTitle())
                .build());

        return mapTaskToDto(saved);
    }

    @Transactional
    public InternshipDtos.TaskResponse updateTaskStatus(Long taskId, Task.TaskStatus status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Tâche introuvable"));
        task.setStatus(status);
        Task saved = taskRepository.save(task);

        activityLogRepository.save(ActivityLog.builder()
                .action("TASK_STATUS_UPDATED")
                .entity("Task")
                .entityId(saved.getId())
                .details("Tâche '" + saved.getTitle() + "' passée à " + status.name())
                .build());

        return mapTaskToDto(saved);
    }

    @Transactional
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    // --- EVALUATIONS ---
    @Transactional(readOnly = true)
    public List<InternshipDtos.EvaluationResponse> getEvaluationsByInternship(Long internshipId) {
        return evaluationRepository.findByInternshipId(internshipId).stream()
                .map(this::mapEvaluationToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Evaluation getEvaluationEntity(Long evaluationId) {
        return evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new IllegalArgumentException("Évaluation introuvable: " + evaluationId));
    }

    @Transactional
    public InternshipDtos.EvaluationResponse createEvaluation(Long internshipId, InternshipDtos.EvaluationRequest request, String userEmail) {
        Internship internship = getInternshipEntity(internshipId);
        User evaluator = userEmail != null ? userRepository.findByEmail(userEmail).orElse(internship.getTutor()) : internship.getTutor();

        double tech = request.getTechnicalScore() != null ? request.getTechnicalScore() : 15.0;
        double soft = request.getSoftSkillsScore() != null ? request.getSoftSkillsScore() : 15.0;
        double auto = request.getAutonomyScore() != null ? request.getAutonomyScore() : 15.0;

        Evaluation eval = Evaluation.builder()
                .internship(internship)
                .evaluator(evaluator)
                .type(request.getType() != null ? request.getType() : Evaluation.EvaluationType.MID_TERM)
                .technicalScore(tech)
                .softSkillsScore(soft)
                .autonomyScore(auto)
                .comments(request.getComments())
                .build();

        Evaluation saved = evaluationRepository.save(eval);

        String internName = internship.getIntern().getProfile() != null
                ? internship.getIntern().getProfile().getFullName()
                : internship.getIntern().getEmail();
        double avg = Math.round(((tech + soft + auto) / 3.0) * 10.0) / 10.0;

        activityLogRepository.save(ActivityLog.builder()
                .user(evaluator)
                .action("EVALUATION_CREATED")
                .entity("Evaluation")
                .entityId(saved.getId())
                .details("Évaluation " + saved.getType().name() + " enregistrée pour " + internName + " (Moyenne: " + avg + "/20)")
                .build());

        return mapEvaluationToDto(saved);
    }

    // --- DOCUMENTS ---
    @Transactional(readOnly = true)
    public List<InternshipDtos.DocumentResponse> getDocumentsByInternship(Long internshipId) {
        return documentRepository.findByInternshipId(internshipId).stream()
                .map(this::mapDocumentToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public InternshipDtos.DocumentResponse createDocument(Long internshipId, InternshipDtos.DocumentRequest request, String userEmail) {
        Internship internship = getInternshipEntity(internshipId);
        User uploader = userEmail != null ? userRepository.findByEmail(userEmail).orElse(internship.getTutor()) : internship.getTutor();

        Document doc = Document.builder()
                .internship(internship)
                .type(request.getType() != null ? request.getType() : Document.DocumentType.OTHER)
                .fileName(request.getFileName() != null ? request.getFileName() : "Document_Stage.pdf")
                .fileUrl(request.getFileUrl() != null ? request.getFileUrl() : "/api/internships/" + internshipId + "/attestation/pdf")
                .uploadedBy(uploader)
                .signed(request.isSigned())
                .build();

        Document saved = documentRepository.save(doc);

        activityLogRepository.save(ActivityLog.builder()
                .user(uploader)
                .action("DOCUMENT_UPLOADED")
                .entity("Document")
                .entityId(saved.getId())
                .details("Document déposé : " + saved.getFileName() + " (" + saved.getType().name() + ")")
                .build());

        return mapDocumentToDto(saved);
    }

    @Transactional
    public InternshipDtos.DocumentResponse toggleDocumentSignature(Long documentId, String userEmail) {
        Document doc = documentRepository.findById(documentId)
                .orElseThrow(() -> new IllegalArgumentException("Document introuvable: " + documentId));
        doc.setSigned(!doc.isSigned());
        Document saved = documentRepository.save(doc);

        User user = userEmail != null ? userRepository.findByEmail(userEmail).orElse(null) : null;
        activityLogRepository.save(ActivityLog.builder()
                .user(user)
                .action("DOCUMENT_SIGNED")
                .entity("Document")
                .entityId(saved.getId())
                .details("Statut de signature de " + saved.getFileName() + " : " + (saved.isSigned() ? "SIGNÉ" : "EN ATTENTE"))
                .build());

        return mapDocumentToDto(saved);
    }

    // --- DASHBOARD STATS & NOTIFICATIONS & CSV EXPORT ---
    @Transactional(readOnly = true)
    public InternshipDtos.DashboardStatsResponse getDashboardStats() {
        long openOffers = offerRepository.findByStatus(InternshipOffer.OfferStatus.OPEN).size();
        long draftOffers = offerRepository.findByStatus(InternshipOffer.OfferStatus.DRAFT).size();
        long closedOffers = offerRepository.findByStatus(InternshipOffer.OfferStatus.CLOSED).size();

        long newCandidates = candidateRepository.countByStatus(Candidate.CandidateStatus.NEW);
        long screeningCandidates = candidateRepository.countByStatus(Candidate.CandidateStatus.SCREENING);
        long interviewCandidates = candidateRepository.countByStatus(Candidate.CandidateStatus.INTERVIEW);
        long acceptedCandidates = candidateRepository.countByStatus(Candidate.CandidateStatus.ACCEPTED);
        long rejectedCandidates = candidateRepository.countByStatus(Candidate.CandidateStatus.REJECTED);
        long totalCandidates = candidateRepository.count();

        long ongoingInternships = internshipRepository.countByStatus(Internship.InternshipStatus.ONGOING);
        long completedInternships = internshipRepository.countByStatus(Internship.InternshipStatus.COMPLETED);
        long upcomingInternships = internshipRepository.countByStatus(Internship.InternshipStatus.UPCOMING);

        long totalInterviews = interviewRepository.count();
        long unsignedDocs = documentRepository.findAll().stream().filter(d -> !d.isSigned()).count();

        List<Evaluation> evals = evaluationRepository.findAll();
        double avgScore = 0.0;
        if (!evals.isEmpty()) {
            avgScore = evals.stream()
                    .mapToDouble(e -> (e.getTechnicalScore() + e.getSoftSkillsScore() + e.getAutonomyScore()) / 3.0)
                    .average()
                    .orElse(0.0);
        }

        List<InternshipDtos.ActivityLogResponse> recentActivities = activityLogRepository
                .findAllByOrderByCreatedAtDesc(PageRequest.of(0, 10))
                .stream()
                .map(a -> InternshipDtos.ActivityLogResponse.builder()
                        .id(a.getId())
                        .userName(a.getUser() != null && a.getUser().getProfile() != null
                                ? a.getUser().getProfile().getFullName()
                                : (a.getUser() != null ? a.getUser().getEmail() : "Portail Public"))
                        .action(a.getAction())
                        .entity(a.getEntity())
                        .entityId(a.getEntityId())
                        .details(a.getDetails())
                        .createdAt(a.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        return InternshipDtos.DashboardStatsResponse.builder()
                .openOffersCount(openOffers)
                .draftOffersCount(draftOffers)
                .closedOffersCount(closedOffers)
                .totalCandidatesCount(totalCandidates)
                .newCandidatesCount(newCandidates)
                .screeningCandidatesCount(screeningCandidates)
                .interviewCandidatesCount(interviewCandidates)
                .acceptedCandidatesCount(acceptedCandidates)
                .rejectedCandidatesCount(rejectedCandidates)
                .ongoingInternshipsCount(ongoingInternships)
                .completedInternshipsCount(completedInternships)
                .upcomingInternshipsCount(upcomingInternships)
                .upcomingEndDatesCount(ongoingInternships)
                .totalInterviewsCount(totalInterviews)
                .unsignedDocumentsCount(unsignedDocs)
                .averageEvaluationScore(Math.round(avgScore * 10.0) / 10.0)
                .recentActivities(recentActivities)
                .build();
    }

    @Transactional(readOnly = true)
    public List<InternshipDtos.NotificationResponse> getNotifications() {
        List<InternshipDtos.NotificationResponse> list = new ArrayList<>();

        // 1. Unsigned conventions alert
        documentRepository.findAll().stream()
                .filter(d -> !d.isSigned())
                .forEach(d -> list.add(InternshipDtos.NotificationResponse.builder()
                        .id("doc-" + d.getId())
                        .title("Signature en attente : " + d.getType().name())
                        .message("Le document '" + d.getFileName() + "' nécessite une validation de signature.")
                        .category("DOCUMENT")
                        .severity("WARNING")
                        .route("/espace-stagiaire")
                        .createdAt(d.getCreatedAt() != null ? d.getCreatedAt() : LocalDateTime.now())
                        .build()));

        // 2. Upcoming interviews alert
        interviewRepository.findAll().stream()
                .filter(i -> i.getScheduledAt() != null && i.getScheduledAt().isAfter(LocalDateTime.now().minusDays(1)))
                .forEach(i -> list.add(InternshipDtos.NotificationResponse.builder()
                        .id("int-" + i.getId())
                        .title("Entretien " + i.getType().name() + " planifié")
                        .message("Candidat : " + i.getCandidate().getFullName() + " (" + i.getCandidate().getSchool() + ")")
                        .category("INTERVIEW")
                        .severity("INFO")
                        .route("/kanban")
                        .createdAt(i.getScheduledAt())
                        .build()));

        // 3. New candidates to review
        long newCount = candidateRepository.countByStatus(Candidate.CandidateStatus.NEW);
        if (newCount > 0) {
            list.add(InternshipDtos.NotificationResponse.builder()
                    .id("cand-new")
                    .title(newCount + " nouvelles candidatures à qualifier")
                    .message("Des candidats attendent une présélection RH dans la colonne 'Nouveau'.")
                    .category("CANDIDATE")
                    .severity("INFO")
                    .route("/kanban")
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        // 4. Tasks in progress
        taskRepository.findAll().stream()
                .filter(t -> t.getStatus() != Task.TaskStatus.DONE)
                .limit(3)
                .forEach(t -> list.add(InternshipDtos.NotificationResponse.builder()
                        .id("task-" + t.getId())
                        .title("Objectif de stage : " + t.getTitle())
                        .message("Échéance prévue : " + (t.getDueDate() != null ? t.getDueDate().toString() : "Bientôt"))
                        .category("TASK")
                        .severity("SUCCESS")
                        .route("/espace-stagiaire")
                        .createdAt(t.getCreatedAt() != null ? t.getCreatedAt() : LocalDateTime.now())
                        .build()));

        return list;
    }

    @Transactional(readOnly = true)
    public byte[] exportRecruitmentReportCsv() {
        StringBuilder sb = new StringBuilder();
        sb.append('\ufeff'); // UTF-8 BOM for Excel
        sb.append("ID;Nom Complet;Email;Telephone;Ecole;Offre;Departement;Statut;Score (/100);Date Candidature;Notes\n");
        for (Candidate c : candidateRepository.findAll()) {
            sb.append(c.getId()).append(';')
                    .append(escapeCsv(c.getFullName())).append(';')
                    .append(escapeCsv(c.getEmail())).append(';')
                    .append(escapeCsv(c.getPhone())).append(';')
                    .append(escapeCsv(c.getSchool())).append(';')
                    .append(escapeCsv(c.getOffer() != null ? c.getOffer().getTitle() : "")).append(';')
                    .append(escapeCsv(c.getOffer() != null && c.getOffer().getDepartment() != null ? c.getOffer().getDepartment().getName() : "")).append(';')
                    .append(c.getStatus().name()).append(';')
                    .append(c.getScore() != null ? c.getScore() : "").append(';')
                    .append(c.getCreatedAt() != null ? c.getCreatedAt().toLocalDate().toString() : "").append(';')
                    .append(escapeCsv(c.getNotes()))
                    .append('\n');
        }
        sb.append("\n--- STAGES EN COURS & SUIVI ---\n");
        sb.append("ID Stage;Stagiaire;Email Stagiaire;Ecole;Encadrant;Departement;Sujet;Debut;Fin;Statut\n");
        for (Internship i : internshipRepository.findAll()) {
            String internName = i.getIntern().getProfile() != null ? i.getIntern().getProfile().getFullName() : i.getIntern().getEmail();
            String school = i.getIntern().getProfile() != null ? i.getIntern().getProfile().getSchool() : "";
            String tutorName = i.getTutor().getProfile() != null ? i.getTutor().getProfile().getFullName() : i.getTutor().getEmail();
            sb.append(i.getId()).append(';')
                    .append(escapeCsv(internName)).append(';')
                    .append(escapeCsv(i.getIntern().getEmail())).append(';')
                    .append(escapeCsv(school)).append(';')
                    .append(escapeCsv(tutorName)).append(';')
                    .append(escapeCsv(i.getDepartment() != null ? i.getDepartment().getName() : "")).append(';')
                    .append(escapeCsv(i.getTopic())).append(';')
                    .append(i.getStartDate() != null ? i.getStartDate().toString() : "").append(';')
                    .append(i.getEndDate() != null ? i.getEndDate().toString() : "").append(';')
                    .append(i.getStatus().name())
                    .append('\n');
        }
        return sb.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escapeCsv(String val) {
        if (val == null) return "";
        return "\"" + val.replace("\"", "\"\"").replace("\n", " ").replace("\r", " ") + "\"";
    }

    private InternshipDtos.InternshipResponse mapToDto(Internship i) {
        List<Task> tasks = taskRepository.findByInternshipId(i.getId());
        long tasksCount = tasks.size();
        long doneTasks = tasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.DONE).count();
        long inProgressTasks = tasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.IN_PROGRESS).count();
        long todoTasks = tasks.stream().filter(t -> t.getStatus() == Task.TaskStatus.TODO).count();
        int progress = tasksCount > 0 ? (int) Math.round((doneTasks * 100.0) / tasksCount) : 0;

        List<Evaluation> evals = evaluationRepository.findByInternshipId(i.getId());
        Double avgEval = null;
        if (!evals.isEmpty()) {
            double raw = evals.stream()
                    .mapToDouble(e -> (e.getTechnicalScore() + e.getSoftSkillsScore() + e.getAutonomyScore()) / 3.0)
                    .average()
                    .orElse(0.0);
            avgEval = Math.round(raw * 10.0) / 10.0;
        }

        List<Document> docs = documentRepository.findByInternshipId(i.getId());
        boolean convSigned = docs.stream()
                .anyMatch(d -> d.getType() == Document.DocumentType.CONVENTION && d.isSigned());

        Profile internProfile = i.getIntern().getProfile();
        Profile tutorProfile = i.getTutor().getProfile();

        return InternshipDtos.InternshipResponse.builder()
                .id(i.getId())
                .internId(i.getIntern().getId())
                .internName(internProfile != null ? internProfile.getFullName() : i.getIntern().getEmail())
                .internEmail(i.getIntern().getEmail())
                .internPhone(internProfile != null ? internProfile.getPhone() : "")
                .internSchool(internProfile != null ? internProfile.getSchool() : "")
                .internLevel(internProfile != null ? internProfile.getLevel() : "Bac+5")
                .tutorId(i.getTutor().getId())
                .tutorName(tutorProfile != null ? tutorProfile.getFullName() : i.getTutor().getEmail())
                .tutorEmail(i.getTutor().getEmail())
                .departmentId(i.getDepartment().getId())
                .departmentName(i.getDepartment().getName())
                .startDate(i.getStartDate())
                .endDate(i.getEndDate())
                .topic(i.getTopic())
                .status(i.getStatus())
                .tasksCount(tasksCount)
                .doneTasksCount(doneTasks)
                .inProgressTasksCount(inProgressTasks)
                .todoTasksCount(todoTasks)
                .progressPercent(progress)
                .evaluationsCount((long) evals.size())
                .averageEvaluationScore(avgEval)
                .documentsCount((long) docs.size())
                .conventionSigned(convSigned)
                .build();
    }

    private InternshipDtos.TaskResponse mapTaskToDto(Task t) {
        String internName = t.getInternship().getIntern().getProfile() != null
                ? t.getInternship().getIntern().getProfile().getFullName()
                : t.getInternship().getIntern().getEmail();
        String assignedByName = t.getAssignedBy().getProfile() != null
                ? t.getAssignedBy().getProfile().getFullName()
                : t.getAssignedBy().getEmail();

        return InternshipDtos.TaskResponse.builder()
                .id(t.getId())
                .internshipId(t.getInternship().getId())
                .internName(internName)
                .title(t.getTitle())
                .description(t.getDescription())
                .dueDate(t.getDueDate())
                .status(t.getStatus())
                .assignedByName(assignedByName)
                .createdAt(t.getCreatedAt())
                .build();
    }

    private InternshipDtos.EvaluationResponse mapEvaluationToDto(Evaluation e) {
        String internName = e.getInternship().getIntern().getProfile() != null
                ? e.getInternship().getIntern().getProfile().getFullName()
                : e.getInternship().getIntern().getEmail();
        String evaluatorName = e.getEvaluator().getProfile() != null
                ? e.getEvaluator().getProfile().getFullName()
                : e.getEvaluator().getEmail();
        double avg = Math.round(((e.getTechnicalScore() + e.getSoftSkillsScore() + e.getAutonomyScore()) / 3.0) * 10.0) / 10.0;

        return InternshipDtos.EvaluationResponse.builder()
                .id(e.getId())
                .internshipId(e.getInternship().getId())
                .internName(internName)
                .internshipTopic(e.getInternship().getTopic())
                .evaluatorName(evaluatorName)
                .type(e.getType())
                .technicalScore(e.getTechnicalScore())
                .softSkillsScore(e.getSoftSkillsScore())
                .autonomyScore(e.getAutonomyScore())
                .averageScore(avg)
                .comments(e.getComments())
                .createdAt(e.getCreatedAt())
                .build();
    }

    private InternshipDtos.DocumentResponse mapDocumentToDto(Document d) {
        String internName = d.getInternship().getIntern().getProfile() != null
                ? d.getInternship().getIntern().getProfile().getFullName()
                : d.getInternship().getIntern().getEmail();
        String uploadedByName = d.getUploadedBy().getProfile() != null
                ? d.getUploadedBy().getProfile().getFullName()
                : d.getUploadedBy().getEmail();

        return InternshipDtos.DocumentResponse.builder()
                .id(d.getId())
                .internshipId(d.getInternship().getId())
                .internName(internName)
                .type(d.getType())
                .fileName(d.getFileName())
                .fileUrl(d.getFileUrl())
                .uploadedByName(uploadedByName)
                .signed(d.isSigned())
                .createdAt(d.getCreatedAt())
                .build();
    }
}
