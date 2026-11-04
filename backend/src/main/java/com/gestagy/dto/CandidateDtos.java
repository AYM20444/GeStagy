package com.gestagy.dto;

import com.gestagy.model.Candidate;
import com.gestagy.model.Interview;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class CandidateDtos {

    public static class CandidateApplicationRequest {
        private Long offerId;
        private String fullName;
        private String email;
        private String phone;
        private String school;
        private String cvUrl;
        private String coverLetterUrl;
        private String notes;
        public CandidateApplicationRequest() {}
        public Long getOfferId() { return offerId; }
        public void setOfferId(Long offerId) { this.offerId = offerId; }
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
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class CandidateResponse {
        private Long id;
        private Long offerId;
        private String offerTitle;
        private Long departmentId;
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
        private long interviewsCount;
        private LocalDateTime nextInterviewAt;
        private LocalDateTime createdAt;

        public CandidateResponse() {}
        public CandidateResponse(Long id, Long offerId, String offerTitle, Long departmentId, String departmentName, String fullName, String email, String phone, String school, String cvUrl, String coverLetterUrl, Candidate.CandidateStatus status, Integer score, String notes, long interviewsCount, LocalDateTime nextInterviewAt, LocalDateTime createdAt) {
            this.id = id;
            this.offerId = offerId;
            this.offerTitle = offerTitle;
            this.departmentId = departmentId;
            this.departmentName = departmentName;
            this.fullName = fullName;
            this.email = email;
            this.phone = phone;
            this.school = school;
            this.cvUrl = cvUrl;
            this.coverLetterUrl = coverLetterUrl;
            this.status = status;
            this.score = score;
            this.notes = notes;
            this.interviewsCount = interviewsCount;
            this.nextInterviewAt = nextInterviewAt;
            this.createdAt = createdAt;
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getOfferId() { return offerId; }
        public void setOfferId(Long offerId) { this.offerId = offerId; }
        public String getOfferTitle() { return offerTitle; }
        public void setOfferTitle(String offerTitle) { this.offerTitle = offerTitle; }
        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
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
        public Candidate.CandidateStatus getStatus() { return status; }
        public void setStatus(Candidate.CandidateStatus status) { this.status = status; }
        public Integer getScore() { return score; }
        public void setScore(Integer score) { this.score = score; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
        public long getInterviewsCount() { return interviewsCount; }
        public void setInterviewsCount(long interviewsCount) { this.interviewsCount = interviewsCount; }
        public LocalDateTime getNextInterviewAt() { return nextInterviewAt; }
        public void setNextInterviewAt(LocalDateTime nextInterviewAt) { this.nextInterviewAt = nextInterviewAt; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private Long id;
            private Long offerId;
            private String offerTitle;
            private Long departmentId;
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
            private long interviewsCount;
            private LocalDateTime nextInterviewAt;
            private LocalDateTime createdAt;
            public Builder id(Long id) { this.id = id; return this; }
            public Builder offerId(Long offerId) { this.offerId = offerId; return this; }
            public Builder offerTitle(String offerTitle) { this.offerTitle = offerTitle; return this; }
            public Builder departmentId(Long departmentId) { this.departmentId = departmentId; return this; }
            public Builder departmentName(String departmentName) { this.departmentName = departmentName; return this; }
            public Builder fullName(String fullName) { this.fullName = fullName; return this; }
            public Builder email(String email) { this.email = email; return this; }
            public Builder phone(String phone) { this.phone = phone; return this; }
            public Builder school(String school) { this.school = school; return this; }
            public Builder cvUrl(String cvUrl) { this.cvUrl = cvUrl; return this; }
            public Builder coverLetterUrl(String coverLetterUrl) { this.coverLetterUrl = coverLetterUrl; return this; }
            public Builder status(Candidate.CandidateStatus status) { this.status = status; return this; }
            public Builder score(Integer score) { this.score = score; return this; }
            public Builder notes(String notes) { this.notes = notes; return this; }
            public Builder interviewsCount(long interviewsCount) { this.interviewsCount = interviewsCount; return this; }
            public Builder nextInterviewAt(LocalDateTime nextInterviewAt) { this.nextInterviewAt = nextInterviewAt; return this; }
            public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
            public CandidateResponse build() { return new CandidateResponse(id, offerId, offerTitle, departmentId, departmentName, fullName, email, phone, school, cvUrl, coverLetterUrl, status, score, notes, interviewsCount, nextInterviewAt, createdAt); }
        }
    }

    public static class UpdateStatusRequest {
        private Candidate.CandidateStatus status;
        public UpdateStatusRequest() {}
        public Candidate.CandidateStatus getStatus() { return status; }
        public void setStatus(Candidate.CandidateStatus status) { this.status = status; }
    }

    public static class UpdateScoreRequest {
        private Integer score;
        private String notes;
        public UpdateScoreRequest() {}
        public Integer getScore() { return score; }
        public void setScore(Integer score) { this.score = score; }
        public String getNotes() { return notes; }
        public void setNotes(String notes) { this.notes = notes; }
    }

    public static class InterviewRequest {
        private Long candidateId;
        private Long interviewerId;
        private LocalDateTime scheduledAt;
        private Interview.InterviewType type;
        private String feedback;
        private Integer rating;
        public InterviewRequest() {}
        public Long getCandidateId() { return candidateId; }
        public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }
        public Long getInterviewerId() { return interviewerId; }
        public void setInterviewerId(Long interviewerId) { this.interviewerId = interviewerId; }
        public LocalDateTime getScheduledAt() { return scheduledAt; }
        public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }
        public Interview.InterviewType getType() { return type; }
        public void setType(Interview.InterviewType type) { this.type = type; }
        public String getFeedback() { return feedback; }
        public void setFeedback(String feedback) { this.feedback = feedback; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
    }

    public static class InterviewFeedbackRequest {
        private String feedback;
        private Integer rating;
        public InterviewFeedbackRequest() {}
        public String getFeedback() { return feedback; }
        public void setFeedback(String feedback) { this.feedback = feedback; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
    }

    public static class InterviewResponse {
        private Long id;
        private Long candidateId;
        private String candidateName;
        private String candidateEmail;
        private String candidateSchool;
        private String offerTitle;
        private Long interviewerId;
        private String interviewerName;
        private LocalDateTime scheduledAt;
        private Interview.InterviewType type;
        private String feedback;
        private Integer rating;
        private LocalDateTime createdAt;

        public InterviewResponse() {}
        public InterviewResponse(Long id, Long candidateId, String candidateName, String candidateEmail, String candidateSchool, String offerTitle, Long interviewerId, String interviewerName, LocalDateTime scheduledAt, Interview.InterviewType type, String feedback, Integer rating, LocalDateTime createdAt) {
            this.id = id;
            this.candidateId = candidateId;
            this.candidateName = candidateName;
            this.candidateEmail = candidateEmail;
            this.candidateSchool = candidateSchool;
            this.offerTitle = offerTitle;
            this.interviewerId = interviewerId;
            this.interviewerName = interviewerName;
            this.scheduledAt = scheduledAt;
            this.type = type;
            this.feedback = feedback;
            this.rating = rating;
            this.createdAt = createdAt;
        }
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getCandidateId() { return candidateId; }
        public void setCandidateId(Long candidateId) { this.candidateId = candidateId; }
        public String getCandidateName() { return candidateName; }
        public void setCandidateName(String candidateName) { this.candidateName = candidateName; }
        public String getCandidateEmail() { return candidateEmail; }
        public void setCandidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; }
        public String getCandidateSchool() { return candidateSchool; }
        public void setCandidateSchool(String candidateSchool) { this.candidateSchool = candidateSchool; }
        public String getOfferTitle() { return offerTitle; }
        public void setOfferTitle(String offerTitle) { this.offerTitle = offerTitle; }
        public Long getInterviewerId() { return interviewerId; }
        public void setInterviewerId(Long interviewerId) { this.interviewerId = interviewerId; }
        public String getInterviewerName() { return interviewerName; }
        public void setInterviewerName(String interviewerName) { this.interviewerName = interviewerName; }
        public LocalDateTime getScheduledAt() { return scheduledAt; }
        public void setScheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; }
        public Interview.InterviewType getType() { return type; }
        public void setType(Interview.InterviewType type) { this.type = type; }
        public String getFeedback() { return feedback; }
        public void setFeedback(String feedback) { this.feedback = feedback; }
        public Integer getRating() { return rating; }
        public void setRating(Integer rating) { this.rating = rating; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private Long id;
            private Long candidateId;
            private String candidateName;
            private String candidateEmail;
            private String candidateSchool;
            private String offerTitle;
            private Long interviewerId;
            private String interviewerName;
            private LocalDateTime scheduledAt;
            private Interview.InterviewType type;
            private String feedback;
            private Integer rating;
            private LocalDateTime createdAt;
            public Builder id(Long id) { this.id = id; return this; }
            public Builder candidateId(Long candidateId) { this.candidateId = candidateId; return this; }
            public Builder candidateName(String candidateName) { this.candidateName = candidateName; return this; }
            public Builder candidateEmail(String candidateEmail) { this.candidateEmail = candidateEmail; return this; }
            public Builder candidateSchool(String candidateSchool) { this.candidateSchool = candidateSchool; return this; }
            public Builder offerTitle(String offerTitle) { this.offerTitle = offerTitle; return this; }
            public Builder interviewerId(Long interviewerId) { this.interviewerId = interviewerId; return this; }
            public Builder interviewerName(String interviewerName) { this.interviewerName = interviewerName; return this; }
            public Builder scheduledAt(LocalDateTime scheduledAt) { this.scheduledAt = scheduledAt; return this; }
            public Builder type(Interview.InterviewType type) { this.type = type; return this; }
            public Builder feedback(String feedback) { this.feedback = feedback; return this; }
            public Builder rating(Integer rating) { this.rating = rating; return this; }
            public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
            public InterviewResponse build() { return new InterviewResponse(id, candidateId, candidateName, candidateEmail, candidateSchool, offerTitle, interviewerId, interviewerName, scheduledAt, type, feedback, rating, createdAt); }
        }
    }

    public static class ConvertToInternRequest {
        private Long tutorId;
        private Long departmentId;
        private LocalDate startDate;
        private LocalDate endDate;
        private String topic;
        public ConvertToInternRequest() {}
        public Long getTutorId() { return tutorId; }
        public void setTutorId(Long tutorId) { this.tutorId = tutorId; }
        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
        public String getTopic() { return topic; }
        public void setTopic(String topic) { this.topic = topic; }
    }
}
