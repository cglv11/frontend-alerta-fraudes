import { Observable } from 'rxjs';
import { TransactionModel } from '../models/transaction.model';
import { CreateTransactionInput } from '../models/transaction.model';

// Abstract class to enable Angular Dependency Injection
export abstract class TransactionRepository {
  abstract create(input: CreateTransactionInput): Observable<TransactionModel>;
  abstract findByUser(userId: string): Observable<TransactionModel[]>;
}
