import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { SalesApiService, MonthlySales } from './sales-api.service';

describe('SalesApiService', () => {
  let service: SalesApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SalesApiService],
    });

    service = TestBed.inject(SalesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call GET /api/sales/monthly with year query param', () => {
    service.fetchMonthlySales(2026).subscribe();

    const req = httpMock.expectOne(
      (r) =>
        r.method === 'GET' &&
        r.url === '/api/sales/monthly' &&
        r.params.get('year') === '2026',
    );

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('should return parsed monthly sales data', () => {
    const mock: MonthlySales[] = [
      { month: '2026-01', total: 12000, orders: 40 },
      { month: '2026-02', total: 9000, orders: 31 },
    ];

    service.fetchMonthlySales(2026).subscribe((data) => {
      expect(data.length).toBe(2);
      expect(data[0].month).toBe('2026-01');
      expect(data[0].total).toBe(12000);
    });

    const req = httpMock.expectOne('/api/sales/monthly?year=2026');
    req.flush(mock);
  });

  it('should surface HTTP errors to the caller', () => {
    service.fetchMonthlySales(2026).subscribe({
      next: () => fail('expected an error'),
      error: (err) => {
        expect(err.status).toBe(500);
      },
    });

    const req = httpMock.expectOne('/api/sales/monthly?year=2026');
    req.flush(
      { message: 'Server error' },
      { status: 500, statusText: 'Server Error' },
    );
  });
});
