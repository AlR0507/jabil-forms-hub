import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../core/services/auth.service';

export interface FormItem {
  id: number;
  name: string;
  by: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  responses: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly TABS = ['Recent', 'My forms', 'Filled forms', 'Shared with me', 'Favorites'] as const;

  readonly TEMPLATES = [
    {
      title: 'Workflow Solution',
      desc: 'Streamline your workflow: collect info, send reminders, view summaries. All set!',
      gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    },
    {
      title: 'Registration',
      desc: 'Event sign-ups, training enrollment, visitor check-in.',
      gradient: 'linear-gradient(135deg, #f97316, #fb923c)',
    },
    {
      title: 'Research',
      desc: 'Surveys, feedback collection, market research.',
      gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
    },
    {
      title: 'Quiz',
      desc: 'Knowledge checks, certifications, compliance tests.',
      gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
    },
  ];

  readonly FORMS: FormItem[] = [
    { id: 1, name: 'Equipment Calibration Log #4421', by: 'Maria Chen', date: 'Today, 09:42', status: 'Pending', responses: 12 },
    { id: 2, name: 'Quality Inspection — Line 3', by: 'David Patel', date: 'Today, 08:15', status: 'Approved', responses: 34 },
    { id: 3, name: 'Material Variance Report', by: 'Aisha Okafor', date: 'Yesterday, 17:22', status: 'Approved', responses: 8 },
    { id: 4, name: 'Safety Incident — Bay 12', by: 'Tomás Rivera', date: 'Yesterday, 14:08', status: 'Rejected', responses: 1 },
    { id: 5, name: 'Shift Handover — Night Crew', by: 'Lin Wei', date: 'Jun 10, 23:05', status: 'Approved', responses: 5 },
    { id: 6, name: 'Supplier Audit Checklist', by: 'Rachel Kim', date: 'Jun 9, 16:30', status: 'Pending', responses: 0 },
  ];

  activeTab = signal<string>('Recent');
  viewMode = signal<'grid' | 'list'>('grid');
  searchQuery = signal<string>('');

  constructor(
    readonly auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  get userInitials(): string {
    const u = this.auth.user();
    if (!u) return '';
    return u.name
      .split(' ')
      .map((s) => s[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  get firstName(): string {
    const u = this.auth.user();
    if (!u) return '';
    return u.name.split(' ')[0];
  }

  get greeting(): string {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }

  get todayFormatted(): string {
    return new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }

  get filteredForms(): FormItem[] {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.FORMS;
    return this.FORMS.filter(
      (f) =>
        f.name.toLowerCase().includes(query) ||
        f.by.toLowerCase().includes(query)
    );
  }

  onTabChange(tab: string): void {
    this.activeTab.set(tab);
    if (tab !== 'Recent') {
      this.snackBar.open(`${tab} view coming soon`, 'Close', { duration: 2500 });
    }
  }

  onTemplateClick(title: string): void {
    this.snackBar.open(`Template "${title}" selected`, 'Close', { duration: 2500 });
  }

  onNavClick(item: string): void {
    if (item !== 'Dashboard') {
      this.snackBar.open(`${item} coming soon`, 'Close', { duration: 2500 });
    }
  }

  onCreateForm(): void {
    this.snackBar.open('New form created', 'Close', { duration: 2500 });
  }

  onCreateQuiz(): void {
    this.snackBar.open('New quiz created', 'Close', { duration: 2500 });
  }

  onImport(): void {
    this.snackBar.open('Import feature coming soon', 'Close', { duration: 2500 });
  }

  onNotificationClick(): void {
    this.snackBar.open('No new notifications', 'Close', { duration: 2500 });
  }

  onProfileClick(): void {
    this.snackBar.open('Profile coming soon', 'Close', { duration: 2500 });
  }

  onSettingsClick(): void {
    this.snackBar.open('Settings coming soon', 'Close', { duration: 2500 });
  }

  onFormClick(name: string): void {
    this.snackBar.open(`Opening "${name}"`, 'Close', { duration: 2500 });
  }

  signOut(): void {
    this.auth.signOut();
    this.snackBar.open('Signed out', 'Close', { duration: 3000 });
    this.router.navigate(['/signin']);
  }
}
