import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GetUserRiskProfileUseCase } from '../../../application/use-cases/get-user-risk-profile.use-case';
import { GetUsersUseCase } from '../../../application/use-cases/get-users.use-case';
import { UserRiskProfileModel } from '../../../domain/models/user-risk-profile.model';
import { UserModel } from '../../../domain/models/user.model';
import { RiskScoreCardComponent } from '../../components/risk-score-card/risk-score-card.component';
import { AlertsListComponent } from '../../components/alerts-list/alerts-list.component';
import { BehavioralStatsCardComponent } from '../../components/behavioral-stats-card/behavioral-stats-card.component';

@Component({
  selector: 'app-user-risk-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RiskScoreCardComponent,
    AlertsListComponent,
    BehavioralStatsCardComponent,
  ],
  templateUrl: './user-risk-dashboard.component.html',
  styleUrl: './user-risk-dashboard.component.css',
})
export class UserRiskDashboardComponent implements OnInit {
  // Signals for component state
  loading = signal(false);
  loadingUsers = signal(false);
  error = signal<string | null>(null);
  riskProfile = signal<UserRiskProfileModel | null>(null);
  users = signal<UserModel[]>([]);

  // Search form
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private getUserRiskProfileUseCase: GetUserRiskProfileUseCase,
    private getUsersUseCase: GetUsersUseCase,
  ) {
    this.searchForm = this.fb.group({
      userId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loadingUsers.set(true);

    this.getUsersUseCase.execute().subscribe({
      next: (users) => {
        this.loadingUsers.set(false);
        this.users.set(users);

        // Auto-select first user if available
        if (users.length > 0) {
          this.searchForm.patchValue({ userId: users[0].userId });
        }
      },
      error: (err) => {
        this.loadingUsers.set(false);
        console.error('Failed to load users:', err);
      },
    });
  }

  onSearch(): void {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      return;
    }

    const userId = this.searchForm.value.userId;

    this.loading.set(true);
    this.error.set(null);
    this.riskProfile.set(null);

    // Execute use case (RxJS Observable)
    this.getUserRiskProfileUseCase.execute(userId).subscribe({
      next: (profile) => {
        this.loading.set(false);
        this.riskProfile.set(profile);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Failed to fetch risk profile');
      },
    });
  }

  // Helper for template
  hasError(field: string, error: string): boolean {
    const control = this.searchForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  // Format date for display
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}
