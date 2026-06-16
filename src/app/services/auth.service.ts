import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// ── Interfaces ───────────────────────────────────────────────
export interface LoginPayload {
  email:    string;
  password: string;
}

export interface LoginResponse {
  success:    boolean;
  message:    string;
  token:      string;
  role:       string;
  redirectTo: string;
  user: {
    id:        number;
    uniqueId?: string;
    email:     string;
    name:      string;
    role:      string;
  };
}

export interface UserProfile {
  success: boolean;
  user: {
    id:        number;
    uniqueId?: string;
    email:     string;
    name:      string;
    role:      string;
  };
}

// ── Service ──────────────────────────────────────────────────
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // All URLs built from ONE source — environment.ts
  private base = environment.BASE_URL;

  constructor(private http: HttpClient) {}

  // ── Auth Calls ─────────────────────────────────────────────

  /** POST /api/auth/login */
  login(payload: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.base}/api/auth/login`,
      payload
    );
  }

  /** POST /api/auth/logout  (JWT required) */
  logout(): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(
      `${this.base}/api/auth/logout`,
      {}
    );
  }

  /** GET /api/auth/me  (JWT required) */
  getMe(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.base}/api/auth/me`);
  }

  // ── User Calls ─────────────────────────────────────────────

  /** GET /api/users/profile  (JWT required) */
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.base}/api/users/profile`);
  }

  /** GET /api/users/dashboard-info  (JWT required) */
  getDashboardInfo(): Observable<any> {
    return this.http.get<any>(`${this.base}/api/users/dashboard-info`);
  }

  // ── Token Helpers ──────────────────────────────────────────

  /** Save token + user to storage */
  saveSession(token: string, user: any, role: string, keepSigned: boolean): void {
    const storage = keepSigned ? localStorage : sessionStorage;
    storage.setItem('dizi_token', token);
    storage.setItem('dizi_user',  JSON.stringify(user));
    storage.setItem('dizi_role',  role);

    if (user && user.name) {
      storage.setItem('dizi_studentName', user.name);
    }
    if (user && user.uniqueId) {
      storage.setItem('dizi_studentId', user.uniqueId);
    } else if (user && user.id) {
      storage.setItem('dizi_studentId', String(user.id));
    }
  }

  /** Get stored token */
  getToken(): string | null {
    return localStorage.getItem('dizi_token') || sessionStorage.getItem('dizi_token');
  }

  /** Get stored role */
  getRole(): string | null {
    return localStorage.getItem('dizi_role') || sessionStorage.getItem('dizi_role');
  }

  /** Check if user is logged in */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /** Clear all stored session data */
  clearSession(): void {
    [
      'dizi_token',
      'dizi_user',
      'dizi_role',
      'dizi_studentName',
      'dizi_studentId',
      'dizi_last_score'
    ].forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }
}
