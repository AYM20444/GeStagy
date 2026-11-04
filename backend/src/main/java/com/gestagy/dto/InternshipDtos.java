package com.gestagy.dto;

import com.gestagy.model.Document;
import com.gestagy.model.Evaluation;
import com.gestagy.model.Internship;
import com.gestagy.model.Task;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class InternshipDtos {

    public static class InternshipCreateRequest {
        private Long internId;
        private Long tutorId;
        private Long departmentId;
        private LocalDate startDate;
        private LocalDate endDate;
        private String topic;
        private Internship.InternshipStatus status;
        public InternshipCreateRequest() {}
        public Long getInternId() { return internId; }
        public void setInternId(Long internId) { this.internId = internId; }
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
        public Internship.InternshipStatus getStatus() { return status; }
        public void setStatus(Internship.InternshipStatus status) { this.status = status; }
    }

    public static class InternshipUpdateRequest {
        private Long tutorId;
        private Long departmentId;
        private LocalDate startDate;
        private LocalDate endDate;
        private String topic;
        private Internship.InternshipStatus status;
        public InternshipUpdateRequest() {}
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
        public Internship.InternshipStatus getStatus() { return status; }
        public void setStatus(Internship.InternshipStatus status) { this.status = status; }
    }

    public static class InternshipResponse {
        private Long id;
        private Long internId;
        private String internName;
        private String internEmail;
        private String internPhone;
        private String internSchool;
        private String internLevel;
        private Long tutorId;
        private String tutorName;
        private String tutorEmail;
        private Long departmentId;
        private String departmentName;
        private LocalDate startDate;
        private LocalDate endDate;
        private String topic;
        private Internship.InternshipStatus status;
        private Long tasksCount;
        private Long doneTasksCount;
        private Long inProgressTasksCount;
        private Long todoTasksCount;
        private int progressPercent;
        private Long evaluationsCount;
        private Double averageEvaluationScore;
        private Long documentsCount;
        private boolean conventionSigned;

        public InternshipResponse() {}
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getInternId() { return internId; }
        public void setInternId(Long internId) { this.internId = internId; }
        public String getInternName() { return internName; }
        public void setInternName(String internName) { this.internName = internName; }
        public String getInternEmail() { return internEmail; }
        public void setInternEmail(String internEmail) { this.internEmail = internEmail; }
        public String getInternPhone() { return internPhone; }
        public void setInternPhone(String internPhone) { this.internPhone = internPhone; }
        public String getInternSchool() { return internSchool; }
        public void setInternSchool(String internSchool) { this.internSchool = internSchool; }
        public String getInternLevel() { return internLevel; }
        public void setInternLevel(String internLevel) { this.internLevel = internLevel; }
        public Long getTutorId() { return tutorId; }
        public void setTutorId(Long tutorId) { this.tutorId = tutorId; }
        public String getTutorName() { return tutorName; }
        public void setTutorName(String tutorName) { this.tutorName = tutorName; }
        public String getTutorEmail() { return tutorEmail; }
        public void setTutorEmail(String tutorEmail) { this.tutorEmail = tutorEmail; }
        public Long getDepartmentId() { return departmentId; }
        public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }
        public String getDepartmentName() { return departmentName; }
        public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }
        public LocalDate getStartDate() { return startDate; }
        public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
        public LocalDate getEndDate() { return endDate; }
        public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
        public String getTopic() { return topic; }
        public void setTopic(String topic) { this.topic = topic; }
        public Internship.InternshipStatus getStatus() { return status; }
        public void setStatus(Internship.InternshipStatus status) { this.status = status; }
        public Long getTasksCount() { return tasksCount; }
        public void setTasksCount(Long tasksCount) { this.tasksCount = tasksCount; }
        public Long getDoneTasksCount() { return doneTasksCount; }
        public void setDoneTasksCount(Long doneTasksCount) { this.doneTasksCount = doneTasksCount; }
        public Long getInProgressTasksCount() { return inProgressTasksCount; }
        public void setInProgressTasksCount(Long inProgressTasksCount) { this.inProgressTasksCount = inProgressTasksCount; }
        public Long getTodoTasksCount() { return todoTasksCount; }
        public void setTodoTasksCount(Long todoTasksCount) { this.todoTasksCount = todoTasksCount; }
        public int getProgressPercent() { return progressPercent; }
        public void setProgressPercent(int progressPercent) { this.progressPercent = progressPercent; }
        public Long getEvaluationsCount() { return evaluationsCount; }
        public void setEvaluationsCount(Long evaluationsCount) { this.evaluationsCount = evaluationsCount; }
        public Double getAverageEvaluationScore() { return averageEvaluationScore; }
        public void setAverageEvaluationScore(Double averageEvaluationScore) { this.averageEvaluationScore = averageEvaluationScore; }
        public Long getDocumentsCount() { return documentsCount; }
        public void setDocumentsCount(Long documentsCount) { this.documentsCount = documentsCount; }
        public boolean isConventionSigned() { return conventionSigned; }
        public void setConventionSigned(boolean conventionSigned) { this.conventionSigned = conventionSigned; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private final InternshipResponse r = new InternshipResponse();
            public Builder id(Long v) { r.setId(v); return this; }
            public Builder internId(Long v) { r.setInternId(v); return this; }
            public Builder internName(String v) { r.setInternName(v); return this; }
            public Builder internEmail(String v) { r.setInternEmail(v); return this; }
            public Builder internPhone(String v) { r.setInternPhone(v); return this; }
            public Builder internSchool(String v) { r.setInternSchool(v); return this; }
            public Builder internLevel(String v) { r.setInternLevel(v); return this; }
            public Builder tutorId(Long v) { r.setTutorId(v); return this; }
            public Builder tutorName(String v) { r.setTutorName(v); return this; }
            public Builder tutorEmail(String v) { r.setTutorEmail(v); return this; }
            public Builder departmentId(Long v) { r.setDepartmentId(v); return this; }
            public Builder departmentName(String v) { r.setDepartmentName(v); return this; }
            public Builder startDate(LocalDate v) { r.setStartDate(v); return this; }
            public Builder endDate(LocalDate v) { r.setEndDate(v); return this; }
            public Builder topic(String v) { r.setTopic(v); return this; }
            public Builder status(Internship.InternshipStatus v) { r.setStatus(v); return this; }
            public Builder tasksCount(Long v) { r.setTasksCount(v); return this; }
            public Builder doneTasksCount(Long v) { r.setDoneTasksCount(v); return this; }
            public Builder inProgressTasksCount(Long v) { r.setInProgressTasksCount(v); return this; }
            public Builder todoTasksCount(Long v) { r.setTodoTasksCount(v); return this; }
            public Builder progressPercent(int v) { r.setProgressPercent(v); return this; }
            public Builder evaluationsCount(Long v) { r.setEvaluationsCount(v); return this; }
            public Builder averageEvaluationScore(Double v) { r.setAverageEvaluationScore(v); return this; }
            public Builder documentsCount(Long v) { r.setDocumentsCount(v); return this; }
            public Builder conventionSigned(boolean v) { r.setConventionSigned(v); return this; }
            public InternshipResponse build() { return r; }
        }
    }

    public static class TaskRequest {
        private String title;
        private String description;
        private LocalDate dueDate;
        private Task.TaskStatus status;
        public TaskRequest() {}
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public LocalDate getDueDate() { return dueDate; }
        public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
        public Task.TaskStatus getStatus() { return status; }
        public void setStatus(Task.TaskStatus status) { this.status = status; }
    }

    public static class TaskResponse {
        private Long id;
        private Long internshipId;
        private String internName;
        private String title;
        private String description;
        private LocalDate dueDate;
        private Task.TaskStatus status;
        private String assignedByName;
        private LocalDateTime createdAt;

        public TaskResponse() {}
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getInternshipId() { return internshipId; }
        public void setInternshipId(Long internshipId) { this.internshipId = internshipId; }
        public String getInternName() { return internName; }
        public void setInternName(String internName) { this.internName = internName; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public LocalDate getDueDate() { return dueDate; }
        public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
        public Task.TaskStatus getStatus() { return status; }
        public void setStatus(Task.TaskStatus status) { this.status = status; }
        public String getAssignedByName() { return assignedByName; }
        public void setAssignedByName(String assignedByName) { this.assignedByName = assignedByName; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private final TaskResponse r = new TaskResponse();
            public Builder id(Long v) { r.setId(v); return this; }
            public Builder internshipId(Long v) { r.setInternshipId(v); return this; }
            public Builder internName(String v) { r.setInternName(v); return this; }
            public Builder title(String v) { r.setTitle(v); return this; }
            public Builder description(String v) { r.setDescription(v); return this; }
            public Builder dueDate(LocalDate v) { r.setDueDate(v); return this; }
            public Builder status(Task.TaskStatus v) { r.setStatus(v); return this; }
            public Builder assignedByName(String v) { r.setAssignedByName(v); return this; }
            public Builder createdAt(LocalDateTime v) { r.setCreatedAt(v); return this; }
            public TaskResponse build() { return r; }
        }
    }

    public static class EvaluationRequest {
        private Evaluation.EvaluationType type;
        private Double technicalScore;
        private Double softSkillsScore;
        private Double autonomyScore;
        private String comments;
        public EvaluationRequest() {}
        public Evaluation.EvaluationType getType() { return type; }
        public void setType(Evaluation.EvaluationType type) { this.type = type; }
        public Double getTechnicalScore() { return technicalScore; }
        public void setTechnicalScore(Double technicalScore) { this.technicalScore = technicalScore; }
        public Double getSoftSkillsScore() { return softSkillsScore; }
        public void setSoftSkillsScore(Double softSkillsScore) { this.softSkillsScore = softSkillsScore; }
        public Double getAutonomyScore() { return autonomyScore; }
        public void setAutonomyScore(Double autonomyScore) { this.autonomyScore = autonomyScore; }
        public String getComments() { return comments; }
        public void setComments(String comments) { this.comments = comments; }
    }

    public static class EvaluationResponse {
        private Long id;
        private Long internshipId;
        private String internName;
        private String internshipTopic;
        private String evaluatorName;
        private Evaluation.EvaluationType type;
        private Double technicalScore;
        private Double softSkillsScore;
        private Double autonomyScore;
        private Double averageScore;
        private String comments;
        private LocalDateTime createdAt;

        public EvaluationResponse() {}
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getInternshipId() { return internshipId; }
        public void setInternshipId(Long internshipId) { this.internshipId = internshipId; }
        public String getInternName() { return internName; }
        public void setInternName(String internName) { this.internName = internName; }
        public String getInternshipTopic() { return internshipTopic; }
        public void setInternshipTopic(String internshipTopic) { this.internshipTopic = internshipTopic; }
        public String getEvaluatorName() { return evaluatorName; }
        public void setEvaluatorName(String evaluatorName) { this.evaluatorName = evaluatorName; }
        public Evaluation.EvaluationType getType() { return type; }
        public void setType(Evaluation.EvaluationType type) { this.type = type; }
        public Double getTechnicalScore() { return technicalScore; }
        public void setTechnicalScore(Double technicalScore) { this.technicalScore = technicalScore; }
        public Double getSoftSkillsScore() { return softSkillsScore; }
        public void setSoftSkillsScore(Double softSkillsScore) { this.softSkillsScore = softSkillsScore; }
        public Double getAutonomyScore() { return autonomyScore; }
        public void setAutonomyScore(Double autonomyScore) { this.autonomyScore = autonomyScore; }
        public Double getAverageScore() { return averageScore; }
        public void setAverageScore(Double averageScore) { this.averageScore = averageScore; }
        public String getComments() { return comments; }
        public void setComments(String comments) { this.comments = comments; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private final EvaluationResponse r = new EvaluationResponse();
            public Builder id(Long v) { r.setId(v); return this; }
            public Builder internshipId(Long v) { r.setInternshipId(v); return this; }
            public Builder internName(String v) { r.setInternName(v); return this; }
            public Builder internshipTopic(String v) { r.setInternshipTopic(v); return this; }
            public Builder evaluatorName(String v) { r.setEvaluatorName(v); return this; }
            public Builder type(Evaluation.EvaluationType v) { r.setType(v); return this; }
            public Builder technicalScore(Double v) { r.setTechnicalScore(v); return this; }
            public Builder softSkillsScore(Double v) { r.setSoftSkillsScore(v); return this; }
            public Builder autonomyScore(Double v) { r.setAutonomyScore(v); return this; }
            public Builder averageScore(Double v) { r.setAverageScore(v); return this; }
            public Builder comments(String v) { r.setComments(v); return this; }
            public Builder createdAt(LocalDateTime v) { r.setCreatedAt(v); return this; }
            public EvaluationResponse build() { return r; }
        }
    }

    public static class DocumentRequest {
        private Document.DocumentType type;
        private String fileName;
        private String fileUrl;
        private boolean signed;
        public DocumentRequest() {}
        public Document.DocumentType getType() { return type; }
        public void setType(Document.DocumentType type) { this.type = type; }
        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        public String getFileUrl() { return fileUrl; }
        public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
        public boolean isSigned() { return signed; }
        public void setSigned(boolean signed) { this.signed = signed; }
    }

    public static class DocumentResponse {
        private Long id;
        private Long internshipId;
        private String internName;
        private Document.DocumentType type;
        private String fileName;
        private String fileUrl;
        private String uploadedByName;
        private boolean signed;
        private LocalDateTime createdAt;

        public DocumentResponse() {}
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public Long getInternshipId() { return internshipId; }
        public void setInternshipId(Long internshipId) { this.internshipId = internshipId; }
        public String getInternName() { return internName; }
        public void setInternName(String internName) { this.internName = internName; }
        public Document.DocumentType getType() { return type; }
        public void setType(Document.DocumentType type) { this.type = type; }
        public String getFileName() { return fileName; }
        public void setFileName(String fileName) { this.fileName = fileName; }
        public String getFileUrl() { return fileUrl; }
        public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }
        public String getUploadedByName() { return uploadedByName; }
        public void setUploadedByName(String uploadedByName) { this.uploadedByName = uploadedByName; }
        public boolean isSigned() { return signed; }
        public void setSigned(boolean signed) { this.signed = signed; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private final DocumentResponse r = new DocumentResponse();
            public Builder id(Long v) { r.setId(v); return this; }
            public Builder internshipId(Long v) { r.setInternshipId(v); return this; }
            public Builder internName(String v) { r.setInternName(v); return this; }
            public Builder type(Document.DocumentType v) { r.setType(v); return this; }
            public Builder fileName(String v) { r.setFileName(v); return this; }
            public Builder fileUrl(String v) { r.setFileUrl(v); return this; }
            public Builder uploadedByName(String v) { r.setUploadedByName(v); return this; }
            public Builder signed(boolean v) { r.setSigned(v); return this; }
            public Builder createdAt(LocalDateTime v) { r.setCreatedAt(v); return this; }
            public DocumentResponse build() { return r; }
        }
    }

    public static class ActivityLogResponse {
        private Long id;
        private String userName;
        private String action;
        private String entity;
        private Long entityId;
        private String details;
        private LocalDateTime createdAt;

        public ActivityLogResponse() {}
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getUserName() { return userName; }
        public void setUserName(String userName) { this.userName = userName; }
        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }
        public String getEntity() { return entity; }
        public void setEntity(String entity) { this.entity = entity; }
        public Long getEntityId() { return entityId; }
        public void setEntityId(Long entityId) { this.entityId = entityId; }
        public String getDetails() { return details; }
        public void setDetails(String details) { this.details = details; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private final ActivityLogResponse r = new ActivityLogResponse();
            public Builder id(Long v) { r.setId(v); return this; }
            public Builder userName(String v) { r.setUserName(v); return this; }
            public Builder action(String v) { r.setAction(v); return this; }
            public Builder entity(String v) { r.setEntity(v); return this; }
            public Builder entityId(Long v) { r.setEntityId(v); return this; }
            public Builder details(String v) { r.setDetails(v); return this; }
            public Builder createdAt(LocalDateTime v) { r.setCreatedAt(v); return this; }
            public ActivityLogResponse build() { return r; }
        }
    }

    public static class NotificationResponse {
        private String id;
        private String title;
        private String message;
        private String category;
        private String severity;
        private String route;
        private LocalDateTime createdAt;

        public NotificationResponse() {}
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getSeverity() { return severity; }
        public void setSeverity(String severity) { this.severity = severity; }
        public String getRoute() { return route; }
        public void setRoute(String route) { this.route = route; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private final NotificationResponse r = new NotificationResponse();
            public Builder id(String v) { r.setId(v); return this; }
            public Builder title(String v) { r.setTitle(v); return this; }
            public Builder message(String v) { r.setMessage(v); return this; }
            public Builder category(String v) { r.setCategory(v); return this; }
            public Builder severity(String v) { r.setSeverity(v); return this; }
            public Builder route(String v) { r.setRoute(v); return this; }
            public Builder createdAt(LocalDateTime v) { r.setCreatedAt(v); return this; }
            public NotificationResponse build() { return r; }
        }
    }

    public static class DashboardStatsResponse {
        private long openOffersCount;
        private long draftOffersCount;
        private long closedOffersCount;
        private long totalCandidatesCount;
        private long newCandidatesCount;
        private long screeningCandidatesCount;
        private long interviewCandidatesCount;
        private long acceptedCandidatesCount;
        private long rejectedCandidatesCount;
        private long ongoingInternshipsCount;
        private long completedInternshipsCount;
        private long upcomingInternshipsCount;
        private long upcomingEndDatesCount;
        private long totalInterviewsCount;
        private long unsignedDocumentsCount;
        private double averageEvaluationScore;
        private List<ActivityLogResponse> recentActivities;

        public DashboardStatsResponse() {}
        public long getOpenOffersCount() { return openOffersCount; }
        public void setOpenOffersCount(long v) { this.openOffersCount = v; }
        public long getDraftOffersCount() { return draftOffersCount; }
        public void setDraftOffersCount(long v) { this.draftOffersCount = v; }
        public long getClosedOffersCount() { return closedOffersCount; }
        public void setClosedOffersCount(long v) { this.closedOffersCount = v; }
        public long getTotalCandidatesCount() { return totalCandidatesCount; }
        public void setTotalCandidatesCount(long v) { this.totalCandidatesCount = v; }
        public long getNewCandidatesCount() { return newCandidatesCount; }
        public void setNewCandidatesCount(long v) { this.newCandidatesCount = v; }
        public long getScreeningCandidatesCount() { return screeningCandidatesCount; }
        public void setScreeningCandidatesCount(long v) { this.screeningCandidatesCount = v; }
        public long getInterviewCandidatesCount() { return interviewCandidatesCount; }
        public void setInterviewCandidatesCount(long v) { this.interviewCandidatesCount = v; }
        public long getAcceptedCandidatesCount() { return acceptedCandidatesCount; }
        public void setAcceptedCandidatesCount(long v) { this.acceptedCandidatesCount = v; }
        public long getRejectedCandidatesCount() { return rejectedCandidatesCount; }
        public void setRejectedCandidatesCount(long v) { this.rejectedCandidatesCount = v; }
        public long getOngoingInternshipsCount() { return ongoingInternshipsCount; }
        public void setOngoingInternshipsCount(long v) { this.ongoingInternshipsCount = v; }
        public long getCompletedInternshipsCount() { return completedInternshipsCount; }
        public void setCompletedInternshipsCount(long v) { this.completedInternshipsCount = v; }
        public long getUpcomingInternshipsCount() { return upcomingInternshipsCount; }
        public void setUpcomingInternshipsCount(long v) { this.upcomingInternshipsCount = v; }
        public long getUpcomingEndDatesCount() { return upcomingEndDatesCount; }
        public void setUpcomingEndDatesCount(long v) { this.upcomingEndDatesCount = v; }
        public long getTotalInterviewsCount() { return totalInterviewsCount; }
        public void setTotalInterviewsCount(long v) { this.totalInterviewsCount = v; }
        public long getUnsignedDocumentsCount() { return unsignedDocumentsCount; }
        public void setUnsignedDocumentsCount(long v) { this.unsignedDocumentsCount = v; }
        public double getAverageEvaluationScore() { return averageEvaluationScore; }
        public void setAverageEvaluationScore(double v) { this.averageEvaluationScore = v; }
        public List<ActivityLogResponse> getRecentActivities() { return recentActivities; }
        public void setRecentActivities(List<ActivityLogResponse> v) { this.recentActivities = v; }

        public static Builder builder() { return new Builder(); }
        public static class Builder {
            private final DashboardStatsResponse r = new DashboardStatsResponse();
            public Builder openOffersCount(long v) { r.setOpenOffersCount(v); return this; }
            public Builder draftOffersCount(long v) { r.setDraftOffersCount(v); return this; }
            public Builder closedOffersCount(long v) { r.setClosedOffersCount(v); return this; }
            public Builder totalCandidatesCount(long v) { r.setTotalCandidatesCount(v); return this; }
            public Builder newCandidatesCount(long v) { r.setNewCandidatesCount(v); return this; }
            public Builder screeningCandidatesCount(long v) { r.setScreeningCandidatesCount(v); return this; }
            public Builder interviewCandidatesCount(long v) { r.setInterviewCandidatesCount(v); return this; }
            public Builder acceptedCandidatesCount(long v) { r.setAcceptedCandidatesCount(v); return this; }
            public Builder rejectedCandidatesCount(long v) { r.setRejectedCandidatesCount(v); return this; }
            public Builder ongoingInternshipsCount(long v) { r.setOngoingInternshipsCount(v); return this; }
            public Builder completedInternshipsCount(long v) { r.setCompletedInternshipsCount(v); return this; }
            public Builder upcomingInternshipsCount(long v) { r.setUpcomingInternshipsCount(v); return this; }
            public Builder upcomingEndDatesCount(long v) { r.setUpcomingEndDatesCount(v); return this; }
            public Builder totalInterviewsCount(long v) { r.setTotalInterviewsCount(v); return this; }
            public Builder unsignedDocumentsCount(long v) { r.setUnsignedDocumentsCount(v); return this; }
            public Builder averageEvaluationScore(double v) { r.setAverageEvaluationScore(v); return this; }
            public Builder recentActivities(List<ActivityLogResponse> v) { r.setRecentActivities(v); return this; }
            public DashboardStatsResponse build() { return r; }
        }
    }
}
