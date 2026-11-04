import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InternshipOffer, Candidate, DashboardStats, Task } from '../models/types';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private base = 'http://localhost:8080/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Offres publiques
  getPublicOffers(): Observable<InternshipOffer[]> {
    return this.http.get<InternshipOffer[]>(`${this.base}/public/offers`);
  }

  // Candidater
  applyOffer(offerId: number, data: any): Observable<Candidate> {
    return this.http.post<Candidate>(`${this.base}/public/offers/${offerId}/apply`, data);
  }

  // Dashboard stats RH
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.base}/recruitment/dashboard/stats`, { headers: this.getHeaders() });
  }

  // Candidats Kanban
  getAllCandidates(): Observable<Candidate[]> {
    return this.http.get<Candidate[]>(`${this.base}/recruitment/candidates`, { headers: this.getHeaders() });
  }

  // Mettre à jour le statut du candidat (Drag & Drop)
  updateCandidateStatus(id: number, status: string): Observable<Candidate> {
    return this.http.patch<Candidate>(
      `${this.base}/recruitment/candidates/${id}/status`,
      { status },
      { headers: this.getHeaders() }
    );
  }

  // Offres de stage pour le recruteur
  getAllOffers(): Observable<InternshipOffer[]> {
    return this.http.get<InternshipOffer[]>(`${this.base}/recruitment/offers`, { headers: this.getHeaders() });
  }

  // Tâches du stagiaire
  getInternshipTasks(internshipId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.base}/internships/${internshipId}/tasks`, { headers: this.getHeaders() });
  }

  // Mise à jour tâche
  updateTaskStatus(taskId: number, status: string): Observable<Task> {
    return this.http.patch<Task>(
      `${this.base}/internships/tasks/${taskId}/status?status=${status}`,
      {},
      { headers: this.getHeaders() }
    );
  }
}

