import { Observable } from 'rxjs';
import { UserRiskProfileModel } from '../models/user-risk-profile.model';

// Abstract class to enable Angular Dependency Injection
export abstract class FraudDetectionRepository {
  abstract getUserRiskProfile(userId: string): Observable<UserRiskProfileModel>;
}
