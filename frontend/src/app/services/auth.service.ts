import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse, UserProfile } from '../models/types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  currentUser = signal<AuthResponse | null>(null);

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('gestagy_user');
    if (saved) {
      try {
        this.currentUser.set(JSON.parse(saved));
      } catch {
        localStorage.removeItem('gestagy_user');
      }
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => this.setSession(res))
    );
  }

  register(payload: {
    email: string;
    password: string;
    fullName: string;
    phone?: string;
    school?: string;
    fieldOfStudy?: string;
    level?: string;
    role?: string;
  }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      tap(res => this.setSession(res))
    );
  }

  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/me`, { headers: this.getAuthHeaders() });
  }

  updateProfile(payload: Partial<UserProfile> & { newPassword?: string }): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/me`, payload, { headers: this.getAuthHeaders() }).pipe(
      tap(updated => {
        const cur = this.currentUser();
        if (cur) {
          const merged: AuthResponse = {
            ...cur,
            fullName: updated.fullName || cur.fullName,
            phone: updated.phone,
            school: updated.school,
            fieldOfStudy: updated.fieldOfStudy,
            level: updated.level,
            avatarUrl: updated.avatarUrl
          };
          this.setSession(merged);
        }
      })
    );
  }

  setSession(res: AuthResponse) {
    this.currentUser.set(res);
    localStorage.setItem('gestagy_user', JSON.stringify(res));
    if (res.token) {
      localStorage.setItem('gestagy_token', res.token);
    }
  }

  logout() {
    this.currentUser.set(null);
    localStorage.removeItem('gestagy_user');
    localStorage.removeItem('gestagy_token');
  }

  isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user ? user.roles.includes(role) : false;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.currentUser();
    if (!user) return false;
    return roles.some(r => user.roles.includes(r));
  }

  getToken(): string | null {
    return localStorage.getItem('gestagy_token');
  }
}
