import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Score {
  id?: number;
  studentId: string;
  studentName: string;
  examType: string;
  mockTestId: number;
  phy: number;
  chm: number;
  math: number;
  total: number;
  maxMarks: number;
  correct: number;
  wrong: number;
  unattempted: number;
  submittedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ScoreService {

  private base = environment.BASE_URL;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken() || ''}`
    });
  }

  submitScore(payload: Score): Observable<any> {
    return this.http.post(`${this.base}/api/scores`, payload, { headers: this.getHeaders() });
  }

  getScores(): Observable<{ success: boolean, scores: Score[] }> {
    return this.http.get<{ success: boolean, scores: Score[] }>(`${this.base}/api/scores`, { headers: this.getHeaders() });
  }

  getStudentScores(studentId: string): Observable<{ success: boolean, scores: Score[] }> {
    return this.http.get<{ success: boolean, scores: Score[] }>(`${this.base}/api/scores/student/${studentId}`, { headers: this.getHeaders() });
  }
}
