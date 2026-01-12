import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';

// Import repositories
import { TransactionRepository } from './features/transactions/domain/repositories/transaction.repository';
import { TransactionApiRepository } from './features/transactions/infrastructure/repositories/transaction-api.repository';

export const appConfig: ApplicationConfig = {
  providers: [
    // Zoneless mode,
    provideZonelessChangeDetection(),

    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),

    // Dependency Injection: Interface → Implementation
    {
      provide: TransactionRepository,
      useClass: TransactionApiRepository,
    },
  ],
};
