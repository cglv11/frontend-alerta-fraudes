import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-risk-score-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './risk-score-card.component.html',
  styleUrl: './risk-score-card.component.css',
})
export class RiskScoreCardComponent {
  // Inputs using new signals API
  riskScore = input.required<number>();
  riskLevel = input.required<string>();
  activeAlerts = input.required<number>();
  criticalAlerts = input.required<number>();

  // Get color based on risk level
  getRiskColor(): string {
    const level = this.riskLevel().toLowerCase();
    switch (level) {
      case 'critical':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'high':
        return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low':
        return 'bg-green-100 border-green-500 text-green-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  }

  // Get progress bar color
  getProgressColor(): string {
    const level = this.riskLevel().toLowerCase();
    switch (level) {
      case 'critical':
        return 'bg-red-600';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  }
}
