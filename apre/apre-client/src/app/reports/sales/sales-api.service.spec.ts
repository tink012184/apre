import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SalesApiService } from './sales-api.service';

describe('SalesApiService', () => {
  let service: SalesApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(SalesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call GET /api/reports/sales/monthly with year query param', () => {
    service.fetchMonthlySales(2026).subscribe();

    const req = httpMock.expectOne((r) => {
      return (
        r.method === 'GET' &&
        r.url === 'http://localhost:3000/api/reports/sales/monthly' &&
        r.params.get('year') === '2026'
      );
    });

    req.flush([]);
  });

  it('should return parsed monthly sales data', () => {
    const mock = [{ month: '2026-01', total: 100, orders: 2 }];

    service.fetchMonthlySales(2026).subscribe((data) => {
      expect(data).toEqual(mock);
    });

    const req = httpMock.expectOne((r) => {
      return (
        r.method === 'GET' &&
        r.url === 'http://localhost:3000/api/reports/sales/monthly' &&
        r.params.get('year') === '2026'
      );
    });

    req.flush(mock);
  });

  it('should surface HTTP errors to the caller', () => {
    service.fetchMonthlySales(2026).subscribe({
      next: () => fail('expected error'),
      error: (err) => expect(err.status).toBe(500),
    });

    const req = httpMock.expectOne((r) => {
      return (
        r.method === 'GET' &&
        r.url === 'http://localhost:3000/api/reports/sales/monthly' &&
        r.params.get('year') === '2026'
      );
    });

    req.flush('Server error', { status: 500, statusText: 'Server Error' });
  });
});
