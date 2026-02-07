/**
 * Customer Feedback by Product Report (Table Only)
 */

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

import { TableComponent } from '../../../../shared/table/table.component';

export interface FeedbackByProductRow {
  product: string;
  responses: number;
  avgRating: number;
}

@Component({
  selector: 'app-customer-feedback-by-product',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <h2>Customer Feedback by Product</h2>

    <div *ngIf="state === 'loading'" class="loading">
      Loading customer feedback…
    </div>

    <div *ngIf="state === 'error'" class="error">Error: {{ errorMessage }}</div>

    <app-table
      *ngIf="state === 'ready'"
      [title]="''"
      [headers]="headers"
      [data]="rows"
      [sortableColumns]="['product', 'responses', 'avgRating']"
    ></app-table>
  `,
  styles: [
    `
      .loading {
        margin-top: 12px;
      }

      .error {
        margin-top: 12px;
        color: #b00020;
      }
    `,
  ],
})
export class CustomerFeedbackByProductComponent implements OnInit {
  state: 'loading' | 'ready' | 'error' = 'loading';
  errorMessage = '';

  headers = ['product', 'responses', 'avgRating'];
  rows: FeedbackByProductRow[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchFeedback();
  }

  fetchFeedback(): void {
    this.state = 'loading';
    this.errorMessage = '';

    this.http
      .get<
        FeedbackByProductRow[]
      >(`${environment.apiBaseUrl}/reports/customer-feedback/by-product`)
      .subscribe({
        next: (data) => {
          this.rows = data ?? [];
          this.state = 'ready';
        },
        error: (err) => {
          this.state = 'error';
          this.errorMessage =
            err?.message ?? 'Unable to load customer feedback';
        },
      });
  }
}
