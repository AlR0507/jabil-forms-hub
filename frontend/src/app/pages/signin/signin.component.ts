import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent {
  email = '';
  password = '';
  showPassword = false;
  remember = true;
  loading = signal(false);
  shake = signal(false);
  errors = signal<{ email?: string; password?: string }>({});

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    const errs: { email?: string; password?: string } = {};

    if (!this.email) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errs.email = 'Enter a valid email';
    }

    if (!this.password) {
      errs.password = 'Password is required';
    } else if (this.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    }

    this.errors.set(errs);

    if (Object.keys(errs).length) {
      this.triggerShake();
      return;
    }

    this.loading.set(true);
    try {
      await this.auth.signIn(this.email, this.password);
      this.snackBar.open('Welcome back!', 'Close', { duration: 3000 });
      this.router.navigate(['/dashboard']);
    } catch (err) {
      this.triggerShake();
      const message = err instanceof Error ? err.message : 'Sign in failed';
      this.snackBar.open(message, 'Close', { duration: 5000 });
    } finally {
      this.loading.set(false);
    }
  }

  onSsoClick(): void {
    this.snackBar.open('SSO is not configured in this demo', 'Close', { duration: 3000 });
  }

  private triggerShake(): void {
    this.shake.set(true);
    setTimeout(() => this.shake.set(false), 450);
  }
}
