import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  InternshipOffer,
  Candidate,
  DashboardStats,
  Task,
  Department,
  Interview,
  Internship,
  Evaluation,
  DocumentItem,
  NotificationItem,
  UserProfile
} from '../models/types';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly base = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  private getAuthOnlyHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // --- PORTAIL PUBLIC ---
  getPublicOffers(): Observable<InternshipOffer[]> {
    return this.http.get<InternshipOffer[]>(`${this.base}/public/offers`);
  }

  getPublicDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.base}/public/departments`);
  }

  applyOffer(offerId: number, data: Partial<Candidate>): Observable<Candidate> {
    return this.http.post<Candidate>(`${this.base}/public/offers/${offerId}/apply`, data);
  }

  uploadFile(file: File): Observable<{ fileName: string; fileUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ fileName: string; fileUrl: string }>(`${this.base}/public/upload`, formData);
  }

  // --- RECRUTEMENT & OFFRES RH ---
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.base}/recruitment/dashboard/stats`, { headers: this.getHeaders() });
  }

  getAllOffers(): Observable<InternshipOffer[]> {
    return this.http.get<InternshipOffer[]>(`${this.base}/recruitment/offers`, { headers: this.getHeaders() });
  }

  createOffer(offer: Partial<InternshipOffer>): Observable<InternshipOffer> {
    return this.http.post<InternshipOffer>(`${this.base}/recruitment/offers`, offer, { headers: this.getHeaders() });
  }

  updateOffer(id: number, offer: Partial<InternshipOffer>): Observable<InternshipOffer> {
    return this.http.put<InternshipOffer>(`${this.base}/recruitment/offers/${id}`, offer, { headers: this.getHeaders() });
  }

  deleteOffer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/recruitment/offers/${id}`, { headers: this.getHeaders() });
  }

  // --- CANDIDATS & PIPELINE KANBAN ---
  getAllCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.base}/recruitment/candidates`, { headers: this.getHeaders() });
  }

  updateCandidateStatus(id: number, status: string): Observable<Candidate> {
    return this.http.patch<Candidate>(
      `${this.base}/recruitment/candidates/${id}/status`,
      { status },
      { headers: this.getHeaders() }
    );
  }

  updateCandidateScore(id: number, score: number, notes: string): Observable<Candidate> {
    return this.http.patch<Candidate>(
      `${this.base}/recruitment/candidates/${id}/score`,
      { score, notes },
      { headers: this.getHeaders() }
    );
  }

  convertCandidateToIntern(
    candidateId: number,
    payload: { tutorId?: number; departmentId?: number; startDate: string; endDate: string; topic: string }
  ): Observable<Internship> {
    return this.http.post<Internship>(
      `${this.base}/recruitment/candidates/${candidateId}/convert`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  // --- ENTRETIENS ---
  getAllInterviews(): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.base}/recruitment/interviews`, { headers: this.getHeaders() });
  }

  getCandidateInterviews(candidateId: number): Observable<Interview[]> {
    return this.http.get<Interview[]>(`${this.base}/recruitment/candidates/${candidateId}/interviews`, { headers: this.getHeaders() });
  }

  scheduleInterview(
    candidateId: number,
    payload: { interviewerId?: number; scheduledAt: string; type: string; feedback?: string; rating?: number }
  ): Observable<Interview> {
    return this.http.post<Interview>(
      `${this.base}/recruitment/candidates/${candidateId}/interviews`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  saveInterviewFeedback(interviewId: number, payload: { feedback: string; rating: number }): Observable<Interview> {
    return this.http.patch<Interview>(
      `${this.base}/recruitment/interviews/${interviewId}/feedback`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  getTutors(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.base}/recruitment/tutors`, { headers: this.getHeaders() });
  }

  exportRecruitmentCsv(): Observable<Blob> {
    return this.http.get(`${this.base}/recruitment/reports/export.csv`, {
      headers: this.getAuthOnlyHeaders(),
      responseType: 'blob'
    });
  }

  // --- STAGES, TÂCHES, ÉVALUATIONS & DOCUMENTS ---
  getAllInternships(): Observable<Internship[]> {
    return this.http.get<Internship[]>(`${this.base}/internships`, { headers: this.getHeaders() });
  }

  getMyInternships(): Observable<Internship[]> {
    return this.http.get<Internship[]>(`${this.base}/internships/my`, { headers: this.getHeaders() });
  }

  updateInternship(id: number, payload: Partial<Internship>): Observable<Internship> {
    return this.http.put<Internship>(`${this.base}/internships/${id}`, payload, { headers: this.getHeaders() });
  }

  getInternshipTasks(internshipId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.base}/internships/${internshipId}/tasks`, { headers: this.getHeaders() });
  }

  createTask(internshipId: number, payload: Partial<Task>): Observable<Task> {
    return this.http.post<Task>(`${this.base}/internships/${internshipId}/tasks`, payload, { headers: this.getHeaders() });
  }

  updateTaskStatus(taskId: number, status: string): Observable<Task> {
    return this.http.patch<Task>(
      `${this.base}/internships/tasks/${taskId}/status?status=${status}`,
      {},
      { headers: this.getHeaders() }
    );
  }

  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/internships/tasks/${taskId}`, { headers: this.getHeaders() });
  }

  getEvaluations(internshipId: number): Observable<Evaluation[]> {
    return this.http.get<Evaluation[]>(`${this.base}/internships/${internshipId}/evaluations`, { headers: this.getHeaders() });
  }

  createEvaluation(internshipId: number, payload: Partial<Evaluation>): Observable<Evaluation> {
    return this.http.post<Evaluation>(`${this.base}/internships/${internshipId}/evaluations`, payload, { headers: this.getHeaders() });
  }

  downloadEvaluationPdf(evalId: number): Observable<Blob> {
    return this.http.get(`${this.base}/internships/evaluations/${evalId}/pdf`, {
      headers: this.getAuthOnlyHeaders(),
      responseType: 'blob'
    });
  }

  getDocuments(internshipId: number): Observable<DocumentItem[]> {
    return this.http.get<DocumentItem[]>(`${this.base}/internships/${internshipId}/documents`, { headers: this.getHeaders() });
  }

  addDocument(internshipId: number, payload: Partial<DocumentItem>): Observable<DocumentItem> {
    return this.http.post<DocumentItem>(`${this.base}/internships/${internshipId}/documents`, payload, { headers: this.getHeaders() });
  }

  toggleDocumentSignature(docId: number): Observable<DocumentItem> {
    return this.http.patch<DocumentItem>(`${this.base}/internships/documents/${docId}/sign`, {}, { headers: this.getHeaders() });
  }

  downloadAttestationPdf(internshipId: number): Observable<Blob> {
    return this.http.get(`${this.base}/internships/${internshipId}/attestation/pdf`, {
      headers: this.getAuthOnlyHeaders(),
      responseType: 'blob'
    });
  }

  getNotifications(): Observable<NotificationItem[]> {
    return this.http.get<NotificationItem[]>(`${this.base}/internships/notifications/all`, { headers: this.getHeaders() });
  }

  // --- ADMINISTRATION ---
  getAllUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(`${this.base}/admin/users`, { headers: this.getHeaders() });
  }

  createUser(payload: any): Observable<UserProfile> {
    return this.http.post<UserProfile>(`${this.base}/admin/users`, payload, { headers: this.getHeaders() });
  }

  updateUser(id: number, payload: { roles?: string[]; active?: boolean }): Observable<UserProfile> {
    return this.http.patch<UserProfile>(`${this.base}/admin/users/${id}`, payload, { headers: this.getHeaders() });
  }

  getAdminDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.base}/admin/departments`, { headers: this.getHeaders() });
  }

  createDepartment(payload: { name: string; description: string }): Observable<Department> {
    return this.http.post<Department>(`${this.base}/admin/departments`, payload, { headers: this.getHeaders() });
  }

  updateDepartment(id: number, payload: { name: string; description: string }): Observable<Department> {
    return this.http.put<Department>(`${this.base}/admin/departments/${id}`, payload, { headers: this.getHeaders() });
  }
}
