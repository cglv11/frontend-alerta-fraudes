import { Component, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateTransactionUseCase } from '../../../application/use-cases/create-transaction.use-case';
import { CreateTransactionInput } from '../../../domain/models/transaction.model';
import { TransactionFormComponent } from '../../components/transaction-form/transaction-form.component';

@Component({
  selector: 'app-create-transaction',
  standalone: true,
  imports: [CommonModule, TransactionFormComponent],
  templateUrl: './create-transaction.component.html',
  styleUrl: './create-transaction.component.css',
})
export class CreateTransactionComponent {
  @ViewChild(TransactionFormComponent) formComponent!: TransactionFormComponent;

  // Signals for component state
  loading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  constructor(private readonly createTransactionUseCase: CreateTransactionUseCase) {}

  handleFormSubmit(input: CreateTransactionInput): void {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    // Execute use case (RxJS Observable)
    this.createTransactionUseCase.execute(input).subscribe({
      next: (transaction) => {
        this.loading.set(false);
        this.success.set(`Transaction created successfully! ID: ${transaction.id}`);

        // Reset form after success
        this.formComponent.resetForm();

        // Clear success message after 5 seconds
        setTimeout(() => this.success.set(null), 5000);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'An error occurred while creating the transaction');
        this.formComponent.setSubmitting(false);
      },
    });
  }
}
