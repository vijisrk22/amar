import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1>{{ isLogin ? 'Login' : 'Create Account' }}</h1>
        <div class="form-group" *ngIf="!isLogin"><label>Name</label><input type="text" [(ngModel)]="form.name" id="auth-name" /></div>
        <div class="form-group"><label>Email</label><input type="email" [(ngModel)]="form.email" id="auth-email" /></div>
        <div class="form-group"><label>Password</label><input type="password" [(ngModel)]="form.password" id="auth-password" /></div>
        <p class="error" *ngIf="error">{{ error }}</p>
        <button class="btn btn-primary" style="width:100%" (click)="submit()" id="auth-submit">{{ isLogin ? 'Login' : 'Register' }}</button>
        <p class="switch-mode">
          {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
          <button (click)="isLogin = !isLogin; error = ''">{{ isLogin ? 'Register' : 'Login' }}</button>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { padding-top: calc(var(--header-height) + 60px); min-height: 80vh; display: flex; justify-content: center; }
    .auth-card { width: 100%; max-width: 420px; padding: 0 24px; }
    h1 { text-align: center; margin-bottom: 32px; }
    .error { color: var(--color-error); font-size: 14px; margin-bottom: 12px; }
    .switch-mode { text-align: center; font-size: 14px; margin-top: 20px; color: var(--color-gray-700);
      button { background: none; border: none; color: var(--color-black); font-weight: 600; cursor: pointer; text-decoration: underline; }
    }
  `]
})
export class AuthComponent {
  isLogin = true;
  form = { name: '', email: '', password: '' };
  error = '';

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    if (this.isLogin) {
      this.api.login(this.form.email, this.form.password).subscribe({
        next: (res) => { this.auth.login(res.token, res.user); this.router.navigate(['/']); },
        error: (err) => this.error = err.error?.error || 'Login failed'
      });
    } else {
      this.api.register(this.form.name, this.form.email, this.form.password).subscribe({
        next: (res) => { this.auth.login(res.token, res.user); this.router.navigate(['/']); },
        error: (err) => this.error = err.error?.error || 'Registration failed'
      });
    }
  }
}
