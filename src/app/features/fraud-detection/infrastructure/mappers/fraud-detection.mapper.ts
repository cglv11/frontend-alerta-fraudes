import { UserRiskProfileModel } from '../../domain/models/user-risk-profile.model';
import { FraudAlertModel } from '../../domain/models/fraud-alert.model';
import { BehavioralStatsModel } from '../../domain/models/behavioral-stats.model';

// DTO coming from backend
export interface UserRiskProfileDTO {
  userId: string;
  riskScore: number;
  riskLevel: string;
  activeAlertsCount: number;
  criticalAlertsCount: number;
  alerts: {
    type: string;
    severity: string;
    message: string;
    transactionIds: string[];
    detectedAt: string;
    metadata?: Record<string, any>;
  }[];
  stats: {
    last24h: {
      transactionCount: number;
      totalAmount: number;
      avgAmount: number;
      countries: string[];
    };
    last30d: {
      transactionCount: number;
      totalAmount: number;
      avgAmount: number;
      countries: string[];
    };
  };
  calculatedAt: string;
}

export class FraudDetectionMapper {
  // Convert backend DTO → Domain model
  static toDomain(dto: UserRiskProfileDTO): UserRiskProfileModel {
    // Map alerts
    const alerts = dto.alerts.map((alertDto) =>
      FraudAlertModel.fromPrimitives({
        type: alertDto.type as any,
        severity: alertDto.severity as any,
        message: alertDto.message,
        transactionIds: alertDto.transactionIds,
        detectedAt: new Date(alertDto.detectedAt),
        metadata: alertDto.metadata,
      }),
    );

    // Map stats
    const stats = BehavioralStatsModel.fromPrimitives(dto.stats);

    // Map profile
    return UserRiskProfileModel.fromPrimitives({
      userId: dto.userId,
      riskScore: dto.riskScore,
      riskLevel: dto.riskLevel as any,
      activeAlertsCount: dto.activeAlertsCount,
      criticalAlertsCount: dto.criticalAlertsCount,
      alerts,
      stats,
      calculatedAt: new Date(dto.calculatedAt),
    });
  }
}
