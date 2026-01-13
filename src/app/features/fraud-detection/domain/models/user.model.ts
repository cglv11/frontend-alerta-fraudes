export interface User {
  userId: string;
  transactionCount: number;
  lastTransactionDate: Date;
}

export class UserModel {
  private constructor(
    public readonly userId: string,
    public readonly transactionCount: number,
    public readonly lastTransactionDate: Date,
  ) {}

  // Re-hydration from API
  static fromPrimitives(data: User): UserModel {
    return new UserModel(data.userId, data.transactionCount, new Date(data.lastTransactionDate));
  }

  // Format for display
  getDisplayName(): string {
    return `${this.userId} (${this.transactionCount} transactions)`;
  }
}
