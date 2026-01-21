import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  catchError,
  map,
  of,
  shareReplay,
  startWith,
  combineLatest,
} from 'rxjs';

import { SalesApiService, MonthlySales } from '../../sales/sales-api.service';
import { TableComponent } from '../../../shared/table/table.component';

type Row = { month: string; total: number; orders: number | '' };

type Vm =
  | { state: 'loading' }
  | { state: 'error'; message: string }
  | {
      state: 'ready';
      years: number[];
      selectedYear: number;
      months: string[]; // "YYYY-MM"
      selectedMonth: string; // "All" | "YYYY-MM"
      rows: Row[];
    };

@Component({
  selector: 'app-sales-by-month',
  standalone: true,
  imports: [CommonModule, FormsModule, TableComponent],
  template: `
    <section>
      <h2>Sales by Month</h2>

      <ng-container *ngIf="vm$ | async as vm">
        <p *ngIf="vm.state === 'loading'">Loading…</p>

        <p *ngIf="vm.state === 'error'" class="error">
          {{ vm.message }}
        </p>

        <ng-container *ngIf="vm.state === 'ready'">
          <div class="filters">
            <label>
              Year:
              <select [(ngModel)]="selectedYear">
                <option *ngFor="let y of vm.years" [ngValue]="y">
                  {{ y }}
                </option>
              </select>
            </label>

            <label>
              Month:
              <select [(ngModel)]="selectedMonth">
                <option [ngValue]="'All'">All months</option>
                <option *ngFor="let m of vm.months" [ngValue]="m">
                  {{ formatMonth(m) }}
                </option>
              </select>
            </label>
          </div>

          <app-table [rows]="vm.rows"></app-table>
        </ng-container>
      </ng-container>
    </section>
  `,
  styles: [
    `
      .error {
        color: #b00020;
      }
      .filters {
        display: flex;
        gap: 16px;
        align-items: center;
        margin: 8px 0 12px;
      }
      label {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      select {
        padding: 4px 8px;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesByMonthComponent {
  selectedYear: number | null = null;
  selectedMonth: 'All' | string = 'All';

  private data$ = this.salesApi.fetchMonthlySales().pipe(
    shareReplay({ bufferSize: 1, refCount: true }),
    catchError((err) =>
      of({
        __error: true as const,
        message: err?.message ?? 'Failed to load sales data',
      }),
    ),
  );

  private normalized$ = this.data$.pipe(
    map((res) => {
      if ((res as any)?.__error) return res;

      const items = res as MonthlySales[];

      // keep only valid YYYY-MM
      return items.filter((i) =>
        /^\d{4}-\d{2}$/.test(String((i as any).month ?? '')),
      );
    }),
  );

  vm$ = combineLatest([
    this.normalized$.pipe(startWith(null)),
    of(null).pipe(startWith(null)),
  ]).pipe(
    map(([norm]) => {
      if (norm === null) return { state: 'loading' as const } satisfies Vm;

      if ((norm as any)?.__error) {
        return {
          state: 'error' as const,
          message: (norm as any).message,
        } satisfies Vm;
      }

      const items = norm as MonthlySales[];

      // Years available from the data
      const years = Array.from(
        new Set(items.map((i) => Number(String((i as any).month).slice(0, 4)))),
      )
        .filter((y) => Number.isFinite(y))
        .sort((a, b) => b - a);

      // Default year
      if (this.selectedYear === null || !years.includes(this.selectedYear)) {
        this.selectedYear = years[0] ?? new Date().getFullYear();
        this.selectedMonth = 'All';
      }

      const selectedYear = this.selectedYear;

      // Months available for selected year (sorted ascending)
      const months = Array.from(
        new Set(
          items
            .map((i) => String((i as any).month))
            .filter((m) => Number(m.slice(0, 4)) === selectedYear),
        ),
      ).sort(); // "YYYY-MM" sorts correctly lexicographically

      // If month no longer exists for that year, reset
      if (
        this.selectedMonth !== 'All' &&
        !months.includes(this.selectedMonth)
      ) {
        this.selectedMonth = 'All';
      }

      const selectedMonth = this.selectedMonth;

      const yearItems = items
        .filter(
          (i) => Number(String((i as any).month).slice(0, 4)) === selectedYear,
        )
        .sort((a, b) =>
          String((a as any).month).localeCompare(String((b as any).month)),
        );

      const rows: Row[] =
        selectedMonth === 'All'
          ? yearItems.map((i) => ({
              month: this.formatMonth(String((i as any).month)),
              total: (i as any).total,
              orders: (i as any).orders ?? '',
            }))
          : yearItems
              .filter((i) => String((i as any).month) === selectedMonth)
              .map((i) => ({
                month: this.formatMonth(String((i as any).month)),
                total: (i as any).total,
                orders: (i as any).orders ?? '',
              }));

      return {
        state: 'ready' as const,
        years,
        selectedYear,
        months,
        selectedMonth,
        rows,
      } satisfies Vm;
    }),
  );

  constructor(private salesApi: SalesApiService) {}

  formatMonth(yyyyMm: string): string {
    // "2026-01" -> "Jan 2026"
    const [y, m] = yyyyMm.split('-').map((x) => Number(x));
    const date = new Date(y, (m ?? 1) - 1, 1);
    return date.toLocaleString(undefined, { month: 'short', year: 'numeric' });
  }
}
