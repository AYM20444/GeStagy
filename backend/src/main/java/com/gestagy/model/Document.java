package com.gestagy.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DocumentType type; // CONVENTION, ATTESTATION, REPORT, OTHER

    @Column(nullable = false, length = 150)
    private String fileName;

    @Column(nullable = false, length = 255)
    private String fileUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @Column(nullable = false)
    @Builder.Default
    private boolean signed = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum DocumentType {
        CONVENTION,
        ATTESTATION,
        REPORT,
        OTHER
    }
}

