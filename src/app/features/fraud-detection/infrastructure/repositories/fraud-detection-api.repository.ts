import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FraudDetectionRepository } from '../../domain/repositories/fraud-detection.repository';
import { UserRiskProfileModel } from '../../domain/models/user-risk-profile.model';
import { UserModel } from '../../domain/models/user.model';
import {
  FraudDetectionMapper,
  UserRiskProfileDTO,
  UsersListDTO,
} from '../mappers/fraud-detection.mapper';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FraudDetectionApiRepository implements FraudDetectionRepository {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getUserRiskProfile(userId: string): Observable<UserRiskProfileModel> {
    return this.http.get<UserRiskProfileDTO>(`${this.baseUrl}/users/${userId}/risk-profile`).pipe(
      map((dto) => FraudDetectionMapper.toDomain(dto)),
      catchError(this.handleError),
    );
  }

  // New method
  getUsers(): Observable<UserModel[]> {
    return this.http.get<UsersListDTO>(`${this.baseUrl}/users`).pipe(
      map((dto) => FraudDetectionMapper.toUserList(dto)),
      catchError(this.handleError),
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred while fetching data';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = error.error?.error || error.message;
    }

    console.error('❌ FraudDetection Repository error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
