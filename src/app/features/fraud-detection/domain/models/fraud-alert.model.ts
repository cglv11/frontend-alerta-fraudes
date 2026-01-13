export type FraudAlertType = 'HIGH_FREQUENCY' | 'UNUSUAL_COUNTRY' | 'AMOUNT_SPIKE' | 'UNUSUAL_TIME';

export type FraudAlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FraudAlert {
  type: FraudAlertType;
  severity: FraudAlertSeverity;
  message: string;
  transactionIds: string[];
  detectedAt: Date;
  metadata?: Record<string, any>;
}

export class FraudAlertModel {
  private constructor(
    public readonly type: FraudAlertType,
    public readonly severity: FraudAlertSeverity,
    public readonly message: string,
    public readonly transactionIds: string[],
    public readonly detectedAt: Date,
    public readonly metadata?: Record<string, any>,
  ) {}

  // Re-hydration from API
  static fromPrimitives(data: FraudAlert): FraudAlertModel {
    return new FraudAlertModel(
      data.type,
      data.severity,
      data.message,
      data.transactionIds,
      new Date(data.detectedAt),
      data.metadata,
    );
  }

  // Check if alert is critical
  isCritical(): boolean {
    return this.severity === 'CRITICAL';
  }

  // Get severity color for UI
  getSeverityColor(): string {
    switch (this.severity) {
      case 'CRITICAL':
        return 'red';
      case 'HIGH':
        return 'orange';
      case 'MEDIUM':
        return 'yellow';
      case 'LOW':
        return 'blue';
    }
  }

  // Get alert icon
  getAlertIcon(): string {
    switch (this.type) {
      case 'HIGH_FREQUENCY':
        return '⚡';
      case 'UNUSUAL_COUNTRY':
        return '🌍';
      case 'AMOUNT_SPIKE':
        return '📈';
      case 'UNUSUAL_TIME':
        return '🕐';
    }
  }
}
