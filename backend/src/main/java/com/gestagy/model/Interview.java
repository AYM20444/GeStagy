package com.gestagy.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "interviews")
public class Interview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "interviewer_id", nullable = false)
    private User interviewer;

    @Column(nullable = false)
    private LocalDateTime scheduledAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InterviewType type = InterviewType.VIDEO;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private Integer rating;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum InterviewType {
        PHONE,
        VIDEO,
        ONSITE
    }

    public Interview() {}

    public Interview(Long id, Candidate candidate, User interviewer, LocalDateTime scheduledAt, InterviewType type, String feedback, Integer rating, LocalDateTime createdAt) {
        this.id = id;
        this.candidate = candidate;
        this.interviewer = interviewer;
        this.scheduledAt = scheduledAt;
        this.type = type != null ? type : InterviewType.VIDEO;
        this.feedback = feedback;
        this.rating = rating;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Candidate getCandidate() { return candidate; }
    public void setCandidate(Candidate candidate) { this.candidate = candidate; }
    public User getInterviewer() { return interviewer; }
    public void setInterviewer(User interviewer) { this.interviewer = interviewer; }
    public LocalDateTime getScheduledAt() { return scheduledAt; }
    public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }
    public InterviewType getType() { return type; }
    public void setType(InterviewType type) { this.type = type; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Candidate candidate;
        private User interviewer;
        private LocalDateTime scheduledAt;
        private InterviewType type = InterviewType.VIDEO;
        private String feedback;
        private Integer rating;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder candidate(Candidate candidate) { this.candidate = candidate; return this; }
        public Builder interviewer(User interviewer) { this.interviewer = interviewer; return this; }
        public Builder scheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; return this; }
        public Builder type(InterviewType type) { this.type = type; return this; }
        public Builder feedback(String feedback) { this.feedback = feedback; return this; }
        public Builder rating(Integer rating) { this.rating = rating; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Interview build() { return new Interview(id, candidate, interviewer, scheduledAt, type, feedback, rating, createdAt); }
    }
}
