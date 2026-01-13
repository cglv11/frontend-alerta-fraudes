import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FraudAlertModel } from '../../../domain/models/fraud-alert.model';

@Component({
  selector: 'app-alerts-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerts-list.component.html',
  styleUrl: './alerts-list.component.css',
})
export class AlertsListComponent {
  // Input using new signals API
  alerts = input.required<FraudAlertModel[]>();

  // Get severity badge color
  getSeverityColor(severity: string): string {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  // Format date
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}
