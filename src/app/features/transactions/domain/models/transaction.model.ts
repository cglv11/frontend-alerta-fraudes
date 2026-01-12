export interface CreateTransactionInput {
  userId: string;
  amount: number;
  country: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  country: string;
  createdAt: Date;
}

export class TransactionModel {
  private constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly amount: number,
    public readonly country: string,
    public readonly createdAt: Date,
  ) {}

  // Factory method with business rules validation
  static create(input: CreateTransactionInput): TransactionModel {
    if (input.amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }

    if (!input.userId || input.userId.trim() === '') {
      throw new Error('User ID is required');
    }

    if (!input.country || input.country.trim() === '') {
      throw new Error('Country is required');
    }

    return new TransactionModel(
      '', // Backend generate the ID
      input.userId.trim(),
      input.amount,
      input.country.trim().toUpperCase(),
      new Date(),
    );
  }

  // Re-hydration from persistence (API response)
  static fromPrimitives(data: Transaction): TransactionModel {
    return new TransactionModel(
      data.id,
      data.userId,
      data.amount,
      data.country,
      new Date(data.createdAt),
    );
  }

  // Convert to plain object (to send to API)
  toPrimitives(): CreateTransactionInput {
    return {
      userId: this.userId,
      amount: this.amount,
      country: this.country,
    };
  }
}
