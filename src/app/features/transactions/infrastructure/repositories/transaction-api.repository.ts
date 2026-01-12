import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { TransactionRepository } from '../../domain/repositories/transaction.repository';
import { TransactionModel, CreateTransactionInput } from '../../domain/models/transaction.model';
import { TransactionMapper, TransactionDTO } from '../mappers/transaction.mapper';
import { API_CONFIG } from '../../../../core/config/api.config';

@Injectable({
  providedIn: 'root',
})
export class TransactionApiRepository implements TransactionRepository {
  private readonly baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.transactions}`;

  constructor(private readonly http: HttpClient) {}

  create(input: CreateTransactionInput): Observable<TransactionModel> {
    return this.http.post<TransactionDTO>(this.baseUrl, input).pipe(
      map((dto) => TransactionMapper.toDomain(dto)),
      catchError(this.handleError),
    );
  }

  findByUser(userId: string): Observable<TransactionModel[]> {
    return this.http.get<TransactionDTO[]>(`${this.baseUrl}?userId=${userId}`).pipe(
      map((dtos) => TransactionMapper.toDomainList(dtos)),
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = error.error?.error || error.message;
    }

    console.error('❌ Repository error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
