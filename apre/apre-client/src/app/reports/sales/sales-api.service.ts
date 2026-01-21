import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MonthlySales {
  month: string; // e.g. "2026-01" or "Jan 2026"
  total: number; // total sales for the month
  orders?: number; // optional extras
}

@Injectable({ providedIn: 'root' })
export class SalesApiService {
  private readonly baseUrl = '/api/sales';

  constructor(private http: HttpClient) {}

  /**
   * Fetch monthly sales for a given year.
   * Example endpoint: GET /api/sales/monthly?year=2026
   */
  fetchMonthlySales(year?: number) {
    const url = year ? `/api/sales/monthly?year=${year}` : `/api/sales/monthly`;
    return this.http.get<MonthlySales[]>(url);
  }
}
