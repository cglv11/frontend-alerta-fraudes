import { FraudAlertModel } from './fraud-alert.model';
import { BehavioralStatsModel } from './behavioral-stats.model';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface UserRiskProfile {
  userId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  activeAlertsCount: number;
  criticalAlertsCount: number;
  alerts: FraudAlertModel[];
  stats: BehavioralStatsModel;
  calculatedAt: Date;
}

export class UserRiskProfileModel {
  private constructor(
    public readonly userId: string,
    public readonly riskScore: number,
    public readonly riskLevel: RiskLevel,
    public readonly activeAlertsCount: number,
    public readonly criticalAlertsCount: number,
    public readonly alerts: FraudAlertModel[],
    public readonly stats: BehavioralStatsModel,
    public readonly calculatedAt: Date,
  ) {}

  // Re-hydration from API
  static fromPrimitives(data: UserRiskProfile): UserRiskProfileModel {
    return new UserRiskProfileModel(
      data.userId,
      data.riskScore,
      data.riskLevel,
      data.activeAlertsCount,
      data.criticalAlertsCount,
      data.alerts,
      data.stats,
      new Date(data.calculatedAt),
    );
  }

  // Get risk level color
  getRiskLevelColor(): string {
    switch (this.riskLevel) {
      case 'CRITICAL':
        return 'red';
      case 'HIGH':
        return 'orange';
      case 'MEDIUM':
        return 'yellow';
      case 'LOW':
        return 'green';
    }
  }

  // Get risk percentage (for progress bar)
  getRiskPercentage(): number {
    return this.riskScore;
  }

  // Check if user is high risk
  isHighRisk(): boolean {
    return this.riskLevel === 'HIGH' || this.riskLevel === 'CRITICAL';
  }

  // Has alerts
  hasAlerts(): boolean {
    return this.activeAlertsCount > 0;
  }

  // Get critical alerts only
  getCriticalAlerts(): FraudAlertModel[] {
    return this.alerts.filter((alert) => alert.isCritical());
  }
}
