import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

export interface Token {
  access_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;
  private tokenKey = 'taskflow_token';

  constructor(private http: HttpClient) {}

  register(email: string, password: string, full_name?: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, { email, password, full_name });
  }

  login(email: string, password: string): Observable<Token> {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    return this.http.post<Token>(`${this.baseUrl}/login`, formData).pipe(
      tap(token => this.saveToken(token.access_token))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getMe(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }
}
