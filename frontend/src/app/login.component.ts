import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="card">
        <h2>TaskFlow Login</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required />
          </div>
          <button type="submit" [disabled]="loading">{{ loading ? 'Logging in...' : 'Login' }}</button>
          <div *ngIf="error" class="error">{{ error }}</div>
        </form>
        <p>Don't have an account? <a routerLink="/register">Register here</a></p>
      </div>
    </div>
  `,
  styles: [`
    .container { display: flex; justify-content: center; margin-top: 80px; }
    .card { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); width: 400px; }
    h2 { margin-bottom: 24px; text-align: center; }
    .form-group { margin-bottom: 16px; }
    label { display: block; margin-bottom: 8px; font-weight: 500; }
    input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    button { width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #ccc; }
    .error { margin-top: 12px; color: red; }
    p { margin-top: 16px; text-align: center; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    this.authService.login(this.email, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/tasks']);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = err.error?.detail || 'Login failed';
      }
    });
  }
}
