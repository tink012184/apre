import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '../../../shared/table/table.component';
import { SalesApiService, MonthlySales } from '../../sales/sales-api.service';
import { catchError, map, of, startWith } from 'rxjs';

type Row = {
  month: string; // "January", "February", ...
  total: number; // summed across all years
  orders: number; // summed across all years
};

type Vm =
  | { state: 'loading' }
  | { state: 'error'; message: string }
  | { state: 'ready'; rows: Row[] };

@Component({
  selector: 'app-sales-by-month',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <section>
      <h2>Sales by Month</h2>

      <ng-container *ngIf="vm$ | async as vm">
        <p *ngIf="vm.state === 'loading'">Loading…</p>

        <p *ngIf="vm.state === 'error'" class="error">
          {{ vm.message }}
        </p>

        <app-table
          *ngIf="vm.state === 'ready'"
          title="Sales by Month (All Years)"
          [headers]="['month', 'total', 'orders']"
          [data]="vm.rows ?? []"
        ></app-table>
      </ng-container>
    </section>
  `,
  styles: [
    `
      .error {
        color: #b00020;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesByMonthComponent {
  constructor(private salesApi: SalesApiService) {}

  vm$ = this.salesApi.fetchMonthlySales().pipe(
    map((items) => {
      console.log('monthly API sample:', items?.slice?.(0, 5));

      const totalsByMonth = Array.from({ length: 12 }, () => ({
        total: 0,
        orders: 0,
      }));

      for (const i of items ?? []) {
        // supports "YYYY-MM" or similar where month is after "-"
        const raw = String((i as any).month ?? (i as any)._id ?? '');
        const parts = raw.split('-');
        const mm = Number(parts[1]);

        if (!Number.isFinite(mm) || mm < 1 || mm > 12) continue;

        totalsByMonth[mm - 1].total += Number((i as any).total ?? 0);
        totalsByMonth[mm - 1].orders += Number((i as any).orders ?? 0);
      }

      const rows: Row[] = totalsByMonth.map((v, idx) => ({
        month: this.monthLabel(idx + 1),
        total: v.total,
        orders: v.orders,
      }));

      return { state: 'ready' as const, rows } satisfies Vm;
    }),
    startWith({ state: 'loading' as const } satisfies Vm),
    catchError((err) =>
      of({
        state: 'error' as const,
        message: `Failed to load sales data: ${err?.message ?? err}`,
      } satisfies Vm),
    ),
  );

  private monthLabel(month: number): string {
    const date = new Date(2000, month - 1, 1); // dummy year so year never appears
    return date.toLocaleString(undefined, { month: 'long' });
  }
}
