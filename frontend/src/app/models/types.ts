export interface User {
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  roles: string[];
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  email: string;
  fullName: string;
  avatarUrl?: string;
  roles: string[];
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
  status: 'DRAFT' | 'OPEN' | 'CLOSED';
  candidatesCount: number;
  createdAt: string;
}

export interface Candidate {
  id: number;
  offerId: number;
  offerTitle: string;
  departmentName: string;
  fullName: string;
  email: string;
  phone: string;
  school: string;
  cvUrl?: string;
  coverLetterUrl?: string;
  status: 'NEW' | 'SCREENING' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED';
  score?: number;
  notes?: string;
  createdAt: string;
}

export interface DashboardStats {
  openOffersCount: number;
  newCandidatesCount: number;
  ongoingInternshipsCount: number;
  upcomingEndDatesCount: number;
  averageEvaluationScore: number;
  totalCandidatesCount: number;
}

export interface Task {
  id: number;
  internshipId: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  assignedByName: string;
}

