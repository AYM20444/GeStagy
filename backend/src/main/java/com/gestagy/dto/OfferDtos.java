package com.gestagy.dto;

import com.gestagy.model.InternshipOffer;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class OfferDtos {

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OfferRequest {
        private String title;
        private String description;
        private Long departmentId;
        private List<String> skills;
        private Integer durationMonths;
        private LocalDate startDate;
        private String location;
        private InternshipOffer.OfferStatus status;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
    public static class OfferResponse {
        private Long id;
        private String title;
        private String description;
        private Long departmentId;
        private String departmentName;
        private List<String> skills;
        private Integer durationMonths;
        private LocalDate startDate;
        private String location;
        private InternshipOffer.OfferStatus status;
        private Long candidatesCount;
        private LocalDateTime createdAt;
    }
}

