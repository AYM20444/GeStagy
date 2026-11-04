export type RoleName = 'ADMIN' | 'HR' | 'RECRUITER' | 'TUTOR' | 'INTERN';
export type OfferStatus = 'DRAFT' | 'OPEN' | 'CLOSED';
export type CandidateStatus = 'NEW' | 'SCREENING' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED';
export type InterviewType = 'PHONE' | 'VIDEO' | 'ONSITE';
export type InternshipStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type EvaluationType = 'MID_TERM' | 'FINAL';
export type DocumentType = 'CONVENTION' | 'ATTESTATION' | 'REPORT' | 'OTHER';

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  school?: string;
  fieldOfStudy?: string;
  level?: string;
  avatarUrl?: string;
  roles: string[];
}

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  avatarUrl?: string;
  school?: string;
  fieldOfStudy?: string;
  level?: string;
  active: boolean;
  roles: string[];
  createdAt?: string;
}

export interface Department {
  id: number;
  name: string;
  description: string;
  offersCount?: number;
  internshipsCount?: number;
}

export interface InternshipOffer {
  id: number;
  title: string;
  description: string;
  departmentId: number;
  departmentName: string;
  skills: string[];
  durationMonths: number;
  startDate: string;
  location: string;
  status: OfferStatus;
  candidatesCount: number;
  createdByName?: string;
  createdAt: string;
}

export interface Candidate {
  id: number;
  offerId: number;
  offerTitle: string;
  departmentId?: number;
  departmentName: string;
  fullName: string;
  email: string;
  phone: string;
  school: string;
  cvUrl?: string;
  coverLetterUrl?: string;
  status: CandidateStatus;
  score?: number;
  notes?: string;
  interviewsCount?: number;
  nextInterviewAt?: string;
  createdAt: string;
}

export interface Interview {
  id: number;
  candidateId: number;
  candidateName: string;
  candidateEmail?: string;
  candidateSchool?: string;
  offerTitle: string;
  interviewerId: number;
  interviewerName: string;
  scheduledAt: string;
  type: InterviewType;
  feedback?: string;
  rating?: number;
  createdAt?: string;
}

export interface Internship {
  id: number;
  internId: number;
  internName: string;
  internEmail: string;
  internPhone?: string;
  internSchool: string;
  internLevel?: string;
  tutorId: number;
  tutorName: string;
  tutorEmail?: string;
  departmentId: number;
  departmentName: string;
  startDate: string;
  endDate: string;
  topic: string;
  status: InternshipStatus;
  tasksCount: number;
  doneTasksCount: number;
  inProgressTasksCount?: number;
  todoTasksCount?: number;
  progressPercent: number;
  evaluationsCount?: number;
  averageEvaluationScore?: number;
  documentsCount?: number;
  conventionSigned?: boolean;
}

export interface Task {
  id: number;
  internshipId: number;
  internName?: string;
  title: string;
  description: string;
  dueDate: string;
  status: TaskStatus;
  assignedByName: string;
  createdAt?: string;
}

export interface Evaluation {
  id: number;
  internshipId: number;
  internName?: string;
  internshipTopic?: string;
  evaluatorName: string;
  type: EvaluationType;
  technicalScore: number;
  softSkillsScore: number;
  autonomyScore: number;
  averageScore: number;
  comments: string;
  createdAt: string;
}

export interface DocumentItem {
  id: number;
  internshipId: number;
  internName?: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadedByName: string;
  signed: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: number;
  userName: string;
  action: string;
  entity: string;
  entityId?: number;
  details: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'INTERVIEW' | 'TASK' | 'DOCUMENT' | 'EVALUATION' | 'CANDIDATE';
  severity: 'INFO' | 'WARNING' | 'SUCCESS';
  route: string;
  createdAt: string;
}

export interface DashboardStats {
  openOffersCount: number;
  draftOffersCount: number;
  closedOffersCount: number;
  totalCandidatesCount: number;
  newCandidatesCount: number;
  screeningCandidatesCount: number;
  interviewCandidatesCount: number;
  acceptedCandidatesCount: number;
  rejectedCandidatesCount: number;
  ongoingInternshipsCount: number;
  completedInternshipsCount: number;
  upcomingInternshipsCount: number;
  upcomingEndDatesCount: number;
  totalInterviewsCount: number;
  unsignedDocumentsCount: number;
  averageEvaluationScore: number;
  recentActivities: ActivityLog[];
}
