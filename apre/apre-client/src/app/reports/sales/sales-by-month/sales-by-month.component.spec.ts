import { TestBed } from '@angular/core/testing';
import { of, Subject, throwError } from 'rxjs';
import { SalesByMonthComponent } from './sales-by-month.component';
import { SalesApiService } from '../../sales/sales-api.service';

describe('SalesByMonthComponent', () => {
  it('should show loading state initially', async () => {
    const subj = new Subject<any[]>(); // no emission yet => loading

    const salesApiMock = {
      fetchMonthlySales: jasmine
        .createSpy()
        .and.returnValue(subj.asObservable()),
    };

    await TestBed.configureTestingModule({
      imports: [SalesByMonthComponent],
      providers: [{ provide: SalesApiService, useValue: salesApiMock }],
    }).compileComponents();

    const fixture = TestBed.createComponent(SalesByMonthComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Loading');
  });

  it('should display error message on API failure', async () => {
    const salesApiMock = {
      fetchMonthlySales: jasmine
        .createSpy()
        .and.returnValue(throwError(() => new Error('boom'))),
    };

    await TestBed.configureTestingModule({
      imports: [SalesByMonthComponent],
      providers: [{ provide: SalesApiService, useValue: salesApiMock }],
    }).compileComponents();

    const fixture = TestBed.createComponent(SalesByMonthComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain(
      'Failed to load sales data',
    );
  });

  it('should render the table when data loads', async () => {
    const salesApiMock = {
      fetchMonthlySales: jasmine.createSpy().and.returnValue(
        of([
          { month: '2023-01', total: 100, orders: 2 },
          { month: '2023-02', total: 50, orders: 1 },
        ]),
      ),
    };

    await TestBed.configureTestingModule({
      imports: [SalesByMonthComponent],
      providers: [{ provide: SalesApiService, useValue: salesApiMock }],
    }).compileComponents();

    const fixture = TestBed.createComponent(SalesByMonthComponent);
    fixture.detectChanges();

    // Your template uses <app-table> when ready:
    expect(fixture.nativeElement.querySelector('app-table')).toBeTruthy();
  });
});
