import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';

// Import repositories - Transactions
import { TransactionRepository } from './features/transactions/domain/repositories/transaction.repository';
import { TransactionApiRepository } from './features/transactions/infrastructure/repositories/transaction-api.repository';

// Import repositories - Fraud Detection
import { FraudDetectionRepository } from './features/fraud-detection/domain/repositories/fraud-detection.repository';
import { FraudDetectionApiRepository } from './features/fraud-detection/infrastructure/repositories/fraud-detection-api.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),

    // Dependency Injection: Transactions
    {
      provide: TransactionRepository,
      useClass: TransactionApiRepository,
    },

    // Dependency Injection: Fraud Detection
    {
      provide: FraudDetectionRepository,
      useClass: FraudDetectionApiRepository,
    },
  ],
};
