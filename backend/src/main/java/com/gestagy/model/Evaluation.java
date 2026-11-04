package com.gestagy.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "evaluations")
public class Evaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "evaluator_id", nullable = false)
    private User evaluator;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EvaluationType type;

    @Column(nullable = false)
    private Double technicalScore;

    @Column(nullable = false)
    private Double softSkillsScore;

    @Column(nullable = false)
    private Double autonomyScore;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum EvaluationType {
        MID_TERM,
        FINAL
    }

    public Evaluation() {}

    public Evaluation(Long id, Internship internship, User evaluator, EvaluationType type, Double technicalScore, Double softSkillsScore, Double autonomyScore, String comments, LocalDateTime createdAt) {
        this.id = id;
        this.internship = internship;
        this.evaluator = evaluator;
        this.type = type;
        this.technicalScore = technicalScore;
        this.softSkillsScore = softSkillsScore;
        this.autonomyScore = autonomyScore;
        this.comments = comments;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Internship getInternship() { return internship; }
    public void setInternship(Internship internship) { this.internship = internship; }
    public User getEvaluator() { return evaluator; }
    public void setEvaluator(User evaluator) { this.evaluator = evaluator; }
    public EvaluationType getType() { return type; }
    public void setType(EvaluationType type) { this.type = type; }
    public Double getTechnicalScore() { return technicalScore; }
    public void setTechnicalScore(Double technicalScore) { this.technicalScore = technicalScore; }
    public Double getSoftSkillsScore() { return softSkillsScore; }
    public void setSoftSkillsScore(Double softSkillsScore) { this.softSkillsScore = softSkillsScore; }
    public Double getAutonomyScore() { return autonomyScore; }
    public void setAutonomyScore(Double autonomyScore) { this.autonomyScore = autonomyScore; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Internship internship;
        private User evaluator;
        private EvaluationType type;
        private Double technicalScore;
        private Double softSkillsScore;
        private Double autonomyScore;
        private String comments;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder internship(Internship internship) { this.internship = internship; return this; }
        public Builder evaluator(User evaluator) { this.evaluator = evaluator; return this; }
        public Builder type(EvaluationType type) { this.type = type; return this; }
        public Builder technicalScore(Double technicalScore) { this.technicalScore = technicalScore; return this; }
        public Builder softSkillsScore(Double softSkillsScore) { this.softSkillsScore = softSkillsScore; return this; }
        public Builder autonomyScore(Double autonomyScore) { this.autonomyScore = autonomyScore; return this; }
        public Builder comments(String comments) { this.comments = comments; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Evaluation build() { return new Evaluation(id, internship, evaluator, type, technicalScore, softSkillsScore, autonomyScore, comments, createdAt); }
    }
}
