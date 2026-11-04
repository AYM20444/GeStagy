package com.gestagy.service;

import com.gestagy.dto.InternshipDtos;
import com.gestagy.model.*;
import com.gestagy.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InternshipService {

    private final InternshipRepository internshipRepository;
    private final TaskRepository taskRepository;
    private final EvaluationRepository evaluationRepository;
    private final DocumentRepository documentRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final InternshipOfferRepository offerRepository;
    private final CandidateRepository candidateRepository;

    @Transactional(readOnly = true)
    public List<InternshipDtos.InternshipResponse> getAllInternships() {
        return internshipRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InternshipDtos.InternshipResponse> getInternshipsByIntern(Long internId) {
        return internshipRepository.findByInternId(internId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<InternshipDtos.InternshipResponse> getInternshipsByTutor(Long tutorId) {
        return internshipRepository.findByTutorId(tutorId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public InternshipDtos.InternshipResponse getInternshipById(Long id) {
        Internship internship = internshipRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Stage non trouvé: " + id));
        return mapToDto(internship);
    }

    @Transactional(readOnly = true)
    public List<InternshipDtos.TaskResponse> getTasksByInternship(Long internshipId) {
        return taskRepository.findByInternshipId(internshipId).stream()
                .map(t -> InternshipDtos.TaskResponse.builder()
                        .id(t.getId())
                        .internshipId(internshipId)
                        .title(t.getTitle())
                        .description(t.getDescription())
                        .dueDate(t.getDueDate())
                        .status(t.getStatus())
                        .assignedByName(t.getAssignedBy().getProfile() != null ? t.getAssignedBy().getProfile().getFullName() : t.getAssignedBy().getEmail())
                        .createdAt(t.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public InternshipDtos.TaskResponse createTask(Long internshipId, InternshipDtos.TaskRequest request, String userEmail) {
        Internship internship = internshipRepository.findById(internshipId)
                .orElseThrow(() -> new IllegalArgumentException("Stage non trouvé"));
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé"));

        Task task = Task.builder()
                .internship(internship)
                .title(request.getTitle())
                .description(request.getDescription())
                .dueDate(request.getDueDate())
                .status(request.getStatus() != null ? request.getStatus() : Task.TaskStatus.TODO)
                .assignedBy(user)
                .build();

        Task saved = taskRepository.save(task);

        return InternshipDtos.TaskResponse.builder()
                .id(saved.getId())
                .internshipId(internshipId)
                .title(saved.getTitle())
                .description(saved.getDescription())
                .dueDate(saved.getDueDate())
                .status(saved.getStatus())
                .assignedByName(user.getProfile() != null ? user.getProfile().getFullName() : user.getEmail())
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Transactional
    public InternshipDtos.TaskResponse updateTaskStatus(Long taskId, Task.TaskStatus status) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new IllegalArgumentException("Tâche introuvable"));
        task.setStatus(status);
        Task saved = taskRepository.save(task);

        return InternshipDtos.TaskResponse.builder()
                .id(saved.getId())
                .internshipId(saved.getInternship().getId())
                .title(saved.getTitle())
                .description(saved.getDescription())
                .dueDate(saved.getDueDate())
                .status(saved.getStatus())
                .assignedByName(saved.getAssignedBy().getProfile() != null ? saved.getAssignedBy().getProfile().getFullName() : "")
                .createdAt(saved.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public InternshipDtos.DashboardStatsResponse getDashboardStats() {
        long openOffers = offerRepository.findByStatus(InternshipOffer.OfferStatus.OPEN).size();
        long newCandidates = candidateRepository.countByStatus(Candidate.CandidateStatus.NEW);
        long ongoingInternships = internshipRepository.countByStatus(Internship.InternshipStatus.ONGOING);
        long totalCandidates = candidateRepository.count();

        // Évaluations moyennes
        List<Evaluation> evals = evaluationRepository.findAll();
        double avgScore = 0.0;
        if (!evals.isEmpty()) {
            avgScore = evals.stream()
                    .mapToDouble(e -> (e.getTechnicalScore() + e.getSoftSkillsScore() + e.getAutonomyScore()) / 3.0)
                    .average()
                    .orElse(0.0);
        }

        return InternshipDtos.DashboardStatsResponse.builder()
                .openOffersCount(openOffers)
                .newCandidatesCount(newCandidates)
                .ongoingInternshipsCount(ongoingInternships)
                .upcomingEndDatesCount(3)
                .averageEvaluationScore(Math.round(avgScore * 10.0) / 10.0)
                .totalCandidatesCount(totalCandidates)
                .build();
    }

    private InternshipDtos.InternshipResponse mapToDto(Internship i) {
        long tasksCount = taskRepository.findByInternshipId(i.getId()).size();
        long doneTasks = taskRepository.findByInternshipIdAndStatus(i.getId(), Task.TaskStatus.DONE).size();

        String internName = i.getIntern().getProfile() != null ? i.getIntern().getProfile().getFullName() : i.getIntern().getEmail();
        String tutorName = i.getTutor().getProfile() != null ? i.getTutor().getProfile().getFullName() : i.getTutor().getEmail();

        return InternshipDtos.InternshipResponse.builder()
                .id(i.getId())
                .internId(i.getIntern().getId())
                .internName(internName)
                .internEmail(i.getIntern().getEmail())
                .internSchool(i.getIntern().getProfile() != null ? i.getIntern().getProfile().getSchool() : "")
                .tutorId(i.getTutor().getId())
                .tutorName(tutorName)
                .departmentId(i.getDepartment().getId())
                .departmentName(i.getDepartment().getName())
                .startDate(i.getStartDate())
                .endDate(i.getEndDate())
                .topic(i.getTopic())
                .status(i.getStatus())
                .tasksCount(tasksCount)
                .doneTasksCount(doneTasks)
                .build();
    }
}

