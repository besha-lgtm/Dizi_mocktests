import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

// ── Payload Types ─────────────────────────────────────────────
export interface StudentPayload {
  name:     string;
  email:    string;
  password?: string;
  section:  string;
}

// ── Service ───────────────────────────────────────────────────
@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private base = environment.BASE_URL;

  constructor(
    private http:        HttpClient,
    private authService: AuthService
  ) {}

  /** Attach Bearer token to every protected request */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken() || ''}`
    });
  }

  /** GET /api/students – returns all role='student' rows */
  getStudents(): Observable<any> {
    return this.http.get(`${this.base}/api/students`, { headers: this.getHeaders() });
  }

  /** POST /api/students – register a single student */
  addStudent(payload: StudentPayload): Observable<any> {
    return this.http.post(`${this.base}/api/students`, payload, { headers: this.getHeaders() });
  }

  /** PUT /api/students/{uniqueId} – update a student's profile */
  updateStudent(uniqueId: string, payload: StudentPayload): Observable<any> {
    return this.http.put(`${this.base}/api/students/${uniqueId}`, payload, { headers: this.getHeaders() });
  }

  /** DELETE /api/students/{uniqueId} – remove a student */
  deleteStudent(uniqueId: string): Observable<any> {
    return this.http.delete(`${this.base}/api/students/${uniqueId}`, { headers: this.getHeaders() });
  }

  /** POST /api/students/bulk – register multiple students at once */
  bulkAddStudents(students: StudentPayload[]): Observable<any> {
    return this.http.post(
      `${this.base}/api/students/bulk`,
      { students },
      { headers: this.getHeaders() }
    );
  }
}
