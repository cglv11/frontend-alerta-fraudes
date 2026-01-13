import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehavioralStatsModel } from '../../../domain/models/behavioral-stats.model';

@Component({
  selector: 'app-behavioral-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './behavioral-stats-card.component.html',
  styleUrl: './behavioral-stats-card.component.css',
})
export class BehavioralStatsCardComponent {
  // Input using new signals API
  stats = input.required<BehavioralStatsModel>();

  // Format currency
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  // Get change indicator color
  getChangeColor(change: number): string {
    if (change > 100) return 'text-red-600';
    if (change > 50) return 'text-orange-600';
    if (change > 0) return 'text-yellow-600';
    return 'text-green-600';
  }

  // Get change icon
  getChangeIcon(change: number): string {
    if (change > 0) return '↑';
    if (change < 0) return '↓';
    return '→';
  }
}
