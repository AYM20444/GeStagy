package com.gestagy.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "internship_id", nullable = false)
    private Internship internship;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private DocumentType type;

    @Column(nullable = false, length = 150)
    private String fileName;

    @Column(nullable = false, length = 255)
    private String fileUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @Column(nullable = false)
    private boolean signed = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum DocumentType {
        CONVENTION,
        ATTESTATION,
        REPORT,
        OTHER
    }

    public Document() {}

    public Document(Long id, Internship internship, DocumentType type, String fileName, String fileUrl, User uploadedBy, boolean signed, LocalDateTime createdAt) {
        this.id = id;
        this.internship = internship;
        this.type = type;
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.uploadedBy = uploadedBy;
        this.signed = signed;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Internship getInternship() { return internship; }
    public void setInternship(Internship internship) { this.internship = internship; }
    public DocumentType getType() { return type; }
    public void setType(DocumentType type) { this.type = type; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
    public User getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(User uploadedBy) { this.uploadedBy = uploadedBy; }
    public boolean isSigned() { return signed; }
    public void setSigned(boolean signed) { this.signed = signed; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Internship internship;
        private DocumentType type;
        private String fileName;
        private String fileUrl;
        private User uploadedBy;
        private boolean signed = false;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder internship(Internship internship) { this.internship = internship; return this; }
        public Builder type(DocumentType type) { this.type = type; return this; }
        public Builder fileName(String fileName) { this.fileName = fileName; return this; }
        public Builder fileUrl(String fileUrl) { this.fileUrl = fileUrl; return this; }
        public Builder uploadedBy(User uploadedBy) { this.uploadedBy = uploadedBy; return this; }
        public Builder signed(boolean signed) { this.signed = signed; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Document build() { return new Document(id, internship, type, fileName, fileUrl, uploadedBy, signed, createdAt); }
    }
}
