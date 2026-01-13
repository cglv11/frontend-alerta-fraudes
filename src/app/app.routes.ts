import { Routes } from '@angular/router';
import { CreateTransactionComponent } from './features/transactions/presentation/pages/create-transaction/create-transaction.component';
import { UserRiskDashboardComponent } from './features/fraud-detection/presentation/pages/user-risk-dashboard/user-risk-dashboard.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/transactions/create',
    pathMatch: 'full',
  },
  {
    path: 'transactions/create',
    component: CreateTransactionComponent,
  },
  {
    path: 'fraud-detection/risk-dashboard',
    component: UserRiskDashboardComponent,
  },
];
