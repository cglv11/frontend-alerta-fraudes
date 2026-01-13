import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FraudDetectionRepository } from '../../domain/repositories/fraud-detection.repository';
import { UserRiskProfileModel } from '../../domain/models/user-risk-profile.model';

@Injectable({
  providedIn: 'root', // Singleton across the entire app
})
export class GetUserRiskProfileUseCase {
  constructor(private readonly repository: FraudDetectionRepository) {}

  execute(userId: string): Observable<UserRiskProfileModel> {
    if (!userId || userId.trim() === '') {
      throw new Error('User ID is required');
    }

    return this.repository.getUserRiskProfile(userId.trim());
  }
}
