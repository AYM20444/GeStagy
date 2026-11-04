import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/types';

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
      } catch (e) {
        localStorage.removeItem('gestagy_user');
      }
    }
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        this.currentUser.set(res);
        localStorage.setItem('gestagy_user', JSON.stringify(res));
        localStorage.setItem('gestagy_token', res.token);
      })
    );
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

  getToken(): string | null {
    return localStorage.getItem('gestagy_token');
  }
}

