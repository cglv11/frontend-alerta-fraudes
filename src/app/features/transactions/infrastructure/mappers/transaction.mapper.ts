import { TransactionModel, Transaction } from '../../domain/models/transaction.model';

// DTO coming from backend (may differ from domain model)
export interface TransactionDTO {
  id: string;
  userId: string;
  amount: number;
  country: string;
  createdAt: string; // ⚠️ Comes as string from JSON
}

export class TransactionMapper {
  // Convert backend DTO → Domain model
  static toDomain(dto: TransactionDTO): TransactionModel {
    const transaction: Transaction = {
      id: dto.id,
      userId: dto.userId,
      amount: dto.amount,
      country: dto.country,
      createdAt: new Date(dto.createdAt), // Convert string to Date
    };

    return TransactionModel.fromPrimitives(transaction);
  }

  // Convert array of DTOs → array of domain models
  static toDomainList(dtos: TransactionDTO[]): TransactionModel[] {
    return dtos.map((dto) => this.toDomain(dto));
  }
}
