package com.gestagy.dto;

import com.gestagy.model.Internship;
import com.gestagy.model.Task;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class InternshipDtos {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class InternshipCreateRequest {
        private Long internId;
        private Long tutorId;
        private Long departmentId;
        private LocalDate startDate;
        private LocalDate endDate;
        private String topic;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class InternshipResponse {
        private Long id;
        private Long internId;
        private String internName;
        private String internEmail;
        private String internSchool;
        private Long tutorId;
        private String tutorName;
        private Long departmentId;
        private String departmentName;
        private LocalDate startDate;
        private LocalDate endDate;
        private String topic;
        private Internship.InternshipStatus status;
        private Long tasksCount;
        private Long doneTasksCount;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class TaskRequest {
        private String title;
        private String description;
        private LocalDate dueDate;
        private Task.TaskStatus status;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class TaskResponse {
        private Long id;
        private Long internshipId;
        private String title;
        private String description;
        private LocalDate dueDate;
        private Task.TaskStatus status;
        private String assignedByName;
        private LocalDateTime createdAt;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class EvaluationRequest {
        private String type; // MID_TERM, FINAL
        private Double technicalScore;
        private Double softSkillsScore;
        private Double autonomyScore;
        private String comments;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class EvaluationResponse {
        private Long id;
        private Long internshipId;
        private String evaluatorName;
        private String type;
        private Double technicalScore;
        private Double softSkillsScore;
        private Double autonomyScore;
        private Double averageScore;
        private String comments;
        private LocalDateTime createdAt;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class DashboardStatsResponse {
        private long openOffersCount;
        private long newCandidatesCount;
        private long ongoingInternshipsCount;
        private long upcomingEndDatesCount;
        private double averageEvaluationScore;
        private long totalCandidatesCount;
    }
}

