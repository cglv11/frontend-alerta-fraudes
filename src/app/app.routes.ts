import { Routes } from '@angular/router';
import { CreateTransactionComponent } from './features/transactions/presentation/pages/create-transaction/create-transaction.component';

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
];
