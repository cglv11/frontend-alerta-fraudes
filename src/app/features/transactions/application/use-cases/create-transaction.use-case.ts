import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionModel } from '../../domain/models/transaction.model';
import { CreateTransactionInput } from '../../domain/models/transaction.model';

@Injectable({
  providedIn: 'root', // Singleton across the entire app
})
export class CreateTransactionUseCase {
  constructor(private readonly repository: TransactionRepository) {}

  execute(input: CreateTransactionInput): Observable<TransactionModel> {
    // 1. Validate with domain model
    const transaction = TransactionModel.create(input);

    // 2. Delegate to repository
    return this.repository.create(transaction.toPrimitives()).pipe(
      map((createdTransaction) => {
        console.log('✅ Transaction created:', createdTransaction.id);
        return createdTransaction;
      }),
    );
  }
}
