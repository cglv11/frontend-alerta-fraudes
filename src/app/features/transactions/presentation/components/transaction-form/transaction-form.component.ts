import { Component, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateTransactionInput } from '../../../domain/models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.css',
})
export class TransactionFormComponent {
  // Output event when form is submitted
  readonly formSubmitted = output<CreateTransactionInput>();

  // Signals for component state
  isSubmitting = signal(false);

  // Reactive form
  transactionForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.transactionForm = this.fb.group({
      userId: ['', [Validators.required, Validators.minLength(3)]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      country: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) {
      this.transactionForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);

    const formValue: CreateTransactionInput = {
      userId: this.transactionForm.value.userId,
      amount: Number(this.transactionForm.value.amount),
      country: this.transactionForm.value.country,
    };

    // Emit the event to parent component
    this.formSubmitted.emit(formValue);
  }

  // Helper methods for template
  hasError(field: string, error: string): boolean {
    const control = this.transactionForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.transactionForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  resetForm(): void {
    this.transactionForm.reset();
    this.isSubmitting.set(false);
  }

  setSubmitting(value: boolean): void {
    this.isSubmitting.set(value);
  }
}
