import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container">
      <div class="card">
        <h2>TaskFlow Register</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" required />
          </div>
          <div class="form-group">
            <label>Full Name (Optional)</label>
            <input type="text" [(ngModel)]="full_name" name="full_name" />
          </div>
          <button type="submit" [disabled]="loading">{{ loading ? 'Registering...' : 'Register' }}</button>
          <div *ngIf="error" class="error">{{ error }}</div>
          <div *ngIf="success" class="success">Account created! Redirecting...</div>
        </form>
        <p>Already have an account? <a routerLink="/login">Login here</a></p>
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
    button { width: 100%; padding: 12px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #ccc; }
    .error { margin-top: 12px; color: red; }
    .success { margin-top: 12px; color: green; }
    p { margin-top: 16px; text-align: center; }
  `]
})
export class RegisterComponent {
  email = '';
  password = '';
  full_name = '';
  loading = false;
  error = '';
  success = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true;
    this.error = '';
    this.authService.register(this.email, this.password, this.full_name || undefined).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.error = err.error?.detail || 'Registration failed';
      }
    });
  }
}
