package com.gestagy.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "activity_log")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = false, length = 100)
    private String action; // e.g. "CANDIDATE_STATUS_UPDATED", "OFFER_CREATED", "TASK_COMPLETED"

    @Column(nullable = false, length = 50)
    private String entity; // "Candidate", "Offer", "Task", "Evaluation"

    private Long entityId;

    @Column(length = 255)
    private String details;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

