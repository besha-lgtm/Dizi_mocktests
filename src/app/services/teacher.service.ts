import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private base = environment.BASE_URL;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.auth.getToken() || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getTeachers(): Observable<any> {
    return this.http.get<any>(`${this.base}/api/teachers`, { headers: this.getHeaders() });
  }

  addTeacher(payload: any): Observable<any> {
    return this.http.post<any>(`${this.base}/api/teachers`, payload, { headers: this.getHeaders() });
  }

  updateTeacher(email: string, payload: any): Observable<any> {
    return this.http.put<any>(`${this.base}/api/teachers/${email}`, payload, { headers: this.getHeaders() });
  }

  deleteTeacher(email: string): Observable<any> {
    return this.http.delete<any>(`${this.base}/api/teachers/${email}`, { headers: this.getHeaders() });
  }

  bulkAddTeachers(teachers: any[]): Observable<any> {
    return this.http.post<any>(`${this.base}/api/teachers/bulk`, { teachers }, { headers: this.getHeaders() });
  }
}
