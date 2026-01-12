import { environment } from '../../../environments/environment';

export const API_CONFIG = {
  baseUrl: environment.apiUrl,
  timeout: 30000,
  endpoints: {
    transactions: '/transactions',
  },
};
