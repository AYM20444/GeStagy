package com.gestagy.dto;

import com.gestagy.model.Candidate;
import lombok.*;

import java.time.LocalDateTime;

public class CandidateDtos {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CandidateApplicationRequest {
        private Long offerId;
        private String fullName;
        private String email;
        private String phone;
        private String school;
        private String cvUrl;
        private String coverLetterUrl;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CandidateResponse {
        private Long id;
        private Long offerId;
        private String offerTitle;
        private String departmentName;
        private String fullName;
        private String email;
        private String phone;
        private String school;
        private String cvUrl;
        private String coverLetterUrl;
        private Candidate.CandidateStatus status;
        private Integer score;
        private String notes;
        private LocalDateTime createdAt;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UpdateStatusRequest {
        private Candidate.CandidateStatus status;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class UpdateScoreRequest {
        private Integer score;
        private String notes;
    }
}

