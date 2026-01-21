import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { SalesByMonthComponent } from './sales-by-month.component';
import { SalesApiService, MonthlySales } from '../../sales/sales-api.service';

@Component({
  selector: 'app-table',
  template: '<div class="table-stub"></div>',
  standalone: true,
})
class TableComponentStub {
  @Input() rows: any[] = [];
}

describe('SalesByMonthComponent', () => {
  let fixture: ComponentFixture<SalesByMonthComponent>;
  let salesApi: jasmine.SpyObj<SalesApiService>;

  beforeEach(async () => {
    salesApi = jasmine.createSpyObj('SalesApiService', ['fetchMonthlySales']);

    await TestBed.configureTestingModule({
      imports: [SalesByMonthComponent, TableComponentStub],
      providers: [{ provide: SalesApiService, useValue: salesApi }],
    })
      .overrideComponent(SalesByMonthComponent, {
        set: { imports: [TableComponentStub] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SalesByMonthComponent);
  });

  it('should show loading state initially', () => {
    salesApi.fetchMonthlySales.and.returnValue(of([]));
    fixture.detectChanges();

    const loadingText = fixture.nativeElement.querySelector('p');
    expect(loadingText?.textContent).toContain('Loading');
  });

  it('should render table rows when data loads', () => {
    const mock: MonthlySales[] = [
      { month: '2026-01', total: 12000, orders: 40 },
      { month: '2026-02', total: 9000 },
    ];

    salesApi.fetchMonthlySales.and.returnValue(of(mock));
    fixture.detectChanges();

    const table = fixture.debugElement.query(By.directive(TableComponentStub));
    expect(table).toBeTruthy();

    const instance = table.componentInstance as TableComponentStub;
    expect(instance.rows.length).toBe(2);
    expect(instance.rows[1].orders).toBe('');
  });

  it('should display error message on API failure', () => {
    salesApi.fetchMonthlySales.and.returnValue(
      throwError(() => ({ message: 'API failed' })),
    );

    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.error');
    expect(error?.textContent).toContain('API failed');
  });
});
