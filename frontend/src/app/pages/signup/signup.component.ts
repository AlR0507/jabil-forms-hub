import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  name = '';
  email = '';
  department = '';
  password = '';
  confirm = '';
  showPassword = false;
  showConfirm = false;
  agree = false;
  loading = signal(false);
  shake = signal(false);
  errors = signal<{
    name?: string;
    email?: string;
    department?: string;
    password?: string;
    confirm?: string;
  }>({});

  readonly DEPARTMENTS = [
    'Manufacturing',
    'Quality',
    'Engineering',
    'Logistics',
    'Finance',
    'HR',
    'IT',
    'Other',
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirm(): void {
    this.showConfirm = !this.showConfirm;
  }

  get strength() {
    const pw = this.password;
    if (!pw) return { label: '', score: 0, colorClass: '' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) return { label: 'Weak', score: 1, colorClass: 'weak' };
    if (score === 2 || score === 3) return { label: 'Fair', score: 2, colorClass: 'fair' };
    return { label: 'Strong', score: 3, colorClass: 'strong' };
  }

  async onSubmit(): Promise<void> {
    const errs: {
      name?: string;
      email?: string;
      department?: string;
      password?: string;
      confirm?: string;
    } = {};

    if (!this.name.trim()) {
      errs.name = 'Full name is required';
    }

    if (!this.email) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      errs.email = 'Enter a valid email';
    }

    if (!this.department) {
      errs.department = 'Select a department';
    }

    if (!this.password) {
      errs.password = 'Password is required';
    } else if (this.password.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(this.password)) {
      errs.password = 'Must include 1 uppercase letter';
    } else if (!/\d/.test(this.password)) {
      errs.password = 'Must include 1 number';
    }

    if (!this.confirm) {
      errs.confirm = 'Confirm your password';
    } else if (this.confirm !== this.password) {
      errs.confirm = 'Passwords do not match';
    }

    this.errors.set(errs);

    if (Object.keys(errs).length) {
      this.triggerShake();
      return;
    }

    if (!this.agree) {
      return;
    }

    this.loading.set(true);
    try {
      await this.auth.signUp(this.name, this.email);
      this.snackBar.open('Account created. Welcome to Jabil Forms!', 'Close', { duration: 3000 });
      this.router.navigate(['/dashboard']);
    } catch (err) {
      this.triggerShake();
      const message = err instanceof Error ? err.message : 'Sign up failed';
      this.snackBar.open(message, 'Close', { duration: 5000 });
    } finally {
      this.loading.set(false);
    }
  }

  private triggerShake(): void {
    this.shake.set(true);
    setTimeout(() => this.shake.set(false), 450);
  }
}
