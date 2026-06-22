import { Injectable, signal, computed } from '@angular/core';

export interface User {
  name: string;
  email: string;
}

const STORAGE_KEY = 'jabil_forms_user';
const DEMO_EMAIL = 'demo@jabil.com';
const DEMO_PASSWORD = 'Jabil2025';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSignal = signal<User | null>(null);

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.userSignal());

  constructor() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.userSignal.set(JSON.parse(raw));
      }
    } catch {
      // ignore parse errors
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    // Simulate network delay
    await new Promise(r => setTimeout(r, 500));

    if (email.toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      throw new Error(`Invalid credentials. Use ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
    }

    this.persist({ name: 'Demo User', email });
  }

  async signUp(name: string, email: string): Promise<void> {
    await new Promise(r => setTimeout(r, 500));
    this.persist({ name, email });
  }

  signOut(): void {
    this.persist(null);
  }

  private persist(user: User | null): void {
    this.userSignal.set(user);
    if (user) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }
}
