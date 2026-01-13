export interface PeriodStats {
  transactionCount: number;
  totalAmount: number;
  avgAmount: number;
  countries: string[];
}

export interface BehavioralStats {
  last24h: PeriodStats;
  last30d: PeriodStats;
}

export class BehavioralStatsModel {
  private constructor(
    public readonly last24h: PeriodStats,
    public readonly last30d: PeriodStats,
  ) {}

  // Re-hydration from API
  static fromPrimitives(data: BehavioralStats): BehavioralStatsModel {
    return new BehavioralStatsModel(data.last24h, data.last30d);
  }

  // Calculate percentage change
  getTransactionCountChange(): number {
    if (this.last30d.transactionCount === 0) return 0;
    const dailyAvg = this.last30d.transactionCount / 30;
    return ((this.last24h.transactionCount - dailyAvg) / dailyAvg) * 100;
  }

  getAmountChange(): number {
    if (this.last30d.avgAmount === 0) return 0;
    return ((this.last24h.avgAmount - this.last30d.avgAmount) / this.last30d.avgAmount) * 100;
  }

  hasNewCountries(): boolean {
    const last30dSet = new Set(this.last30d.countries);
    return this.last24h.countries.some((country) => !last30dSet.has(country));
  }
}
