import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GetUserRiskProfileUseCase } from '../../../application/use-cases/get-user-risk-profile.use-case';
import { UserRiskProfileModel } from '../../../domain/models/user-risk-profile.model';
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
export class UserRiskDashboardComponent {
  // Signals for component state
  loading = signal(false);
  error = signal<string | null>(null);
  riskProfile = signal<UserRiskProfileModel | null>(null);

  // Search form
  searchForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private getUserRiskProfileUseCase: GetUserRiskProfileUseCase,
  ) {
    this.searchForm = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(3)]],
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
