package com.gestagy.dto;

import com.gestagy.model.InternshipOffer;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class OfferDtos {

    public static class OfferRequest {
        private String title;
        private String description;
        private Long departmentId;
        private List<String> skills;
        private Integer durationMonths;
        private LocalDate startDate;
        private String location;
        private InternshipOffer.OfferStatus status;
        public OfferRequest() {}
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
        public List<String> getSkills() { return skills; }
        public void setSkills(List<String> skills) { this.skills = skills; }
        public Integer getDurationMonths() { return durationMonths; }
        public void setDurationMonths(Integer durationMonths) { this.durationMonths = durationMonths; }
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public InternshipOffer.OfferStatus getStatus() { return status; }
        public void setStatus(InternshipOffer.OfferStatus status) { this.status = status; }
    }

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
        private String createdByName;
        private LocalDateTime createdAt;

        public OfferResponse() {}
        public OfferResponse(Long id, String title, String description, Long departmentId, String departmentName, List<String> skills, Integer durationMonths, LocalDate startDate, String location, InternshipOffer.OfferStatus status, Long candidatesCount, String createdByName, LocalDateTime createdAt) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.departmentId = departmentId;
            this.departmentName = departmentName;
            this.skills = skills;
            this.durationMonths = durationMonths;
            this.startDate = startDate;
            this.location = location;
            this.status = status;
            this.candidatesCount = candidatesCount;
            this.createdByName = createdByName;
            this.createdAt = createdAt;
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
        public List<String> getSkills() { return skills; }
        public void setSkills(List<String> skills) { this.skills = skills; }
        public Integer getDurationMonths() { return durationMonths; }
        public void setDurationMonths(Integer durationMonths) { this.durationMonths = durationMonths; }
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public String getLocation() { return location; }
        public void setLocation(String location) { this.location = location; }
        public InternshipOffer.OfferStatus getStatus() { return status; }
        public void setStatus(InternshipOffer.OfferStatus status) { this.status = status; }
        public Long getCandidatesCount() { return candidatesCount; }
        public void setCandidatesCount(Long candidatesCount) { this.candidatesCount = candidatesCount; }
        public String getCreatedByName() { return createdByName; }
        public void setCreatedByName(String createdByName) { this.createdByName = createdByName; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
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
            private String createdByName;
            private LocalDateTime createdAt;
            public Builder id(Long id) { this.id = id; return this; }
            public Builder title(String title) { this.title = title; return this; }
            public Builder description(String description) { this.description = description; return this; }
            public Builder departmentId(Long departmentId) { this.departmentId = departmentId; return this; }
            public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
            public Builder skills(List<String> skills) { this.skills = skills; return this; }
            public Builder durationMonths(Integer durationMonths) { this.durationMonths = durationMonths; return this; }
            public Builder startDate(LocalDate startDate) { this.startDate = startDate; return this; }
            public Builder location(String location) { this.location = location; return this; }
            public Builder status(InternshipOffer.OfferStatus status) { this.status = status; return this; }
            public Builder candidatesCount(Long candidatesCount) { this.candidatesCount = candidatesCount; return this; }
            public Builder createdByName(String createdByName) { this.createdByName = createdByName; return this; }
            public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
            public OfferResponse build() { return new OfferResponse(id, title, description, departmentId, departmentName, skills, durationMonths, startDate, location, status, candidatesCount, createdByName, createdAt); }
        }
    }

    public static class DepartmentRequest {
        private String name;
        private String description;
        public DepartmentRequest() {}
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class DepartmentResponse {
        private Long id;
        private String name;
        private String description;
        private long offersCount;
        private long internshipsCount;
        public DepartmentResponse() {}
        public DepartmentResponse(Long id, String name, String description, long offersCount, long internshipsCount) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.offersCount = offersCount;
            this.internshipsCount = internshipsCount;
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public long getOffersCount() { return offersCount; }
        public void setOffersCount(long offersCount) { this.offersCount = offersCount; }
        public long getInternshipsCount() { return internshipsCount; }
        public void setInternshipsCount(long internshipsCount) { this.internshipsCount = internshipsCount; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private Long id;
            private String name;
            private String description;
            private long offersCount;
            private long internshipsCount;
            public Builder id(Long id) { this.id = id; return this; }
            public Builder name(String name) { this.name = name; return this; }
            public Builder description(String description) { this.description = description; return this; }
            public Builder offersCount(long offersCount) { this.offersCount = offersCount; return this; }
            public Builder internshipsCount(long internshipsCount) { this.internshipsCount = internshipsCount; return this; }
            public DepartmentResponse build() { return new DepartmentResponse(id, name, description, offersCount, internshipsCount); }
        }
    }
}
