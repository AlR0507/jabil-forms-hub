import { Component, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnDestroy {
  email = '';
  error = signal<string | null>(null);
  loading = signal(false);
  shake = signal(false);
  sentTo = signal<string | null>(null);
  cooldown = signal(0);
  private timer: any;

  constructor(private snackBar: MatSnackBar) {}

  async onSubmit(): Promise<void> {
    if (!this.email) {
      this.error.set('Email is required');
      this.triggerShake();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
      this.error.set('Enter a valid email');
      this.triggerShake();
      return;
    }

    this.error.set(null);
    this.loading.set(true);

    try {
      await new Promise((r) => setTimeout(r, 600));
      this.sentTo.set(this.email);
      this.startCooldown(30);
    } catch {
      this.triggerShake();
      this.snackBar.open('Failed to send reset link', 'Close', { duration: 5000 });
    } finally {
      this.loading.set(false);
    }
  }

  resend(): void {
    if (this.cooldown() > 0) return;
    this.snackBar.open('Reset link sent again', 'Close', { duration: 3000 });
    this.startCooldown(30);
  }

  private startCooldown(seconds: number): void {
    this.cooldown.set(seconds);
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      const current = this.cooldown();
      if (current <= 1) {
        this.cooldown.set(0);
        clearInterval(this.timer);
      } else {
        this.cooldown.set(current - 1);
      }
    }, 1000);
  }

  private triggerShake(): void {
    this.shake.set(true);
    setTimeout(() => this.shake.set(false), 450);
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
}
