import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// ── Interfaces ─────────────────────────────────────────────────────────────────

export interface Question {
  id           : string;        // e.g. MAT-001, PHY-001, CHE-001
  subject      : string;
  topic        : string;
  examType     : string;        // JEE Mains | JEE Advanced
  mockTestId   : number;
  questionText : string;
  questionImage?: string | null; // Base64 encoded image (optional)
  optionA      : string;
  optionB      : string;
  optionC      : string;
  optionD      : string;
  correctAnswer: string;        // A | B | C | D
  difficulty   : 'Easy' | 'Medium' | 'Hard';
  lastModified?: string;
}

export interface QuestionPayload {
  subject      : string;
  topic        : string;
  examType     : string;
  mockTestId   : number;
  questionText : string;
  questionImage?: string | null;
  optionA      : string;
  optionB      : string;
  optionC      : string;
  optionD      : string;
  correctAnswer: string;
  difficulty   : string;
}

export interface BulkQuestionPayload {
  subject   : string;
  mockTestId: number;
  questions : Omit<QuestionPayload, 'subject'>[];
}

export interface ApiResponse {
  success    : boolean;
  message    : string;
  id?        : string;
  questions? : Question[];
  addedCount?: number;
  errors?    : string[];
}

// ── Service ────────────────────────────────────────────────────────────────────

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private base = environment.BASE_URL;

  constructor(private http: HttpClient) {}

  // ── Token Helper ───────────────────────────────────────────────────────────

  private getHeaders(): HttpHeaders {
    const token =
      localStorage.getItem('dizi_token') ||
      sessionStorage.getItem('dizi_token') || '';

    return new HttpHeaders({
      'Content-Type' : 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ── API Calls ──────────────────────────────────────────────────────────────

  getQuestions(subject?: string, mockTestId?: number, examType?: string): Observable<ApiResponse> {
    let url = `${this.base}/api/questions?`;
    const params: string[] = [];
    if (subject) {
      params.push(`subject=${encodeURIComponent(subject)}`);
    }
    if (mockTestId !== undefined && mockTestId !== null) {
      params.push(`mockTestId=${mockTestId}`);
    }
    if (examType) {
      params.push(`examType=${encodeURIComponent(examType)}`);
    }
    url += params.join('&');
    return this.http.get<ApiResponse>(
      url,
      { headers: this.getHeaders() }
    );
  }

  /**
   * GET /api/questions?mockTestId=1&examType=JEE+Mains
   * Fetches all questions for a specific mock test, optionally filtered by examType
   */
  getQuestionsByMockTest(mockTestId: number, examType?: string): Observable<ApiResponse> {
    let url = `${this.base}/api/questions?mockTestId=${mockTestId}`;
    if (examType) {
      url += `&examType=${encodeURIComponent(examType)}`;
    }
    return this.http.get<ApiResponse>(
      url,
      { headers: this.getHeaders() }
    );
  }

  /**
   * POST /api/questions
   * Adds a single question. Backend auto-generates the prefixed ID.
   */
  addQuestion(payload: QuestionPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.base}/api/questions`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  /**
   * POST /api/questions/bulk
   * Bulk inserts multiple questions parsed from an Excel file
   */
  bulkAddQuestions(payload: BulkQuestionPayload): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.base}/api/questions/bulk`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  /**
   * PUT /api/questions/:id
   * Updates an existing question by its prefixed ID
   */
  updateQuestion(id: string, payload: Omit<QuestionPayload, 'subject'>): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(
      `${this.base}/api/questions/${id}`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  /**
   * DELETE /api/questions/:id
   * Deletes a question by its prefixed ID
   */
  deleteQuestion(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(
      `${this.base}/api/questions/${id}`,
      { headers: this.getHeaders() }
    );
  }
}
