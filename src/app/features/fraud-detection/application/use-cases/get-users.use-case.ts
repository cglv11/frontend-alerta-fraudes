import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FraudDetectionRepository } from '../../domain/repositories/fraud-detection.repository';
import { UserModel } from '../../domain/models/user.model';

@Injectable({
  providedIn: 'root',
})
export class GetUsersUseCase {
  constructor(private readonly repository: FraudDetectionRepository) {}

  execute(): Observable<UserModel[]> {
    return this.repository.getUsers();
  }
}
