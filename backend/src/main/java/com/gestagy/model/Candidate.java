package com.gestagy.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "candidates")
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "offer_id", nullable = false)
    private InternshipOffer offer;

    @Column(nullable = false, length = 120)
    private String fullName;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(length = 150)
    private String school;

    @Column(length = 255)
    private String cvUrl;

    @Column(length = 255)
    private String coverLetterUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CandidateStatus status = CandidateStatus.NEW;

    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum CandidateStatus {
        NEW,
        SCREENING,
        INTERVIEW,
        ACCEPTED,
        REJECTED
    }

    public Candidate() {}

    public Candidate(Long id, InternshipOffer offer, String fullName, String email, String phone, String school, String cvUrl, String coverLetterUrl, CandidateStatus status, Integer score, String notes, LocalDateTime createdAt) {
        this.id = id;
        this.offer = offer;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.school = school;
        this.cvUrl = cvUrl;
        this.coverLetterUrl = coverLetterUrl;
        this.status = status != null ? status : CandidateStatus.NEW;
        this.score = score;
        this.notes = notes;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public InternshipOffer getOffer() { return offer; }
    public void setOffer(InternshipOffer offer) { this.offer = offer; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getSchool() { return school; }
    public void setSchool(String school) { this.school = school; }
    public String getCvUrl() { return cvUrl; }
    public void setCvUrl(String cvUrl) { this.cvUrl = cvUrl; }
    public String getCoverLetterUrl() { return coverLetterUrl; }
    public void setCoverLetterUrl(String coverLetterUrl) { this.coverLetterUrl = coverLetterUrl; }
    public CandidateStatus getStatus() { return status; }
    public void setStatus(CandidateStatus status) { this.status = status; }
    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private InternshipOffer offer;
        private String fullName;
        private String email;
        private String phone;
        private String school;
        private String cvUrl;
        private String coverLetterUrl;
        private CandidateStatus status = CandidateStatus.NEW;
        private Integer score;
        private String notes;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder offer(InternshipOffer offer) { this.offer = offer; return this; }
        public Builder fullName(String fullName) { this.fullName = fullName; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }
        public Builder school(String school) { this.school = school; return this; }
        public Builder cvUrl(String cvUrl) { this.cvUrl = cvUrl; return this; }
        public Builder coverLetterUrl(String coverLetterUrl) { this.coverLetterUrl = coverLetterUrl; return this; }
        public Builder status(CandidateStatus status) { this.status = status; return this; }
        public Builder score(Integer score) { this.score = score; return this; }
        public Builder notes(String notes) { this.notes = notes; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Candidate build() { return new Candidate(id, offer, fullName, email, phone, school, cvUrl, coverLetterUrl, status, score, notes, createdAt); }
    }
}
