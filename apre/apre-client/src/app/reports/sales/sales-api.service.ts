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
  private readonly baseUrl = 'http://localhost:3000/api/reports/sales';

  constructor(private http: HttpClient) {}

  fetchMonthlySales(year?: number): Observable<MonthlySales[]> {
    const url = `${this.baseUrl}/monthly`;

    // year as a query param:
    const params = year ? new HttpParams().set('year', year) : undefined;

    return this.http.get<MonthlySales[]>(url, { params });
  }

  fetchMonthlySalesByMonth(month: string) {
    // calls: /api/reports/sales/monthly?month=2026-01
    return this.http.get<MonthlySales[]>(`${this.baseUrl}/monthly`, {
      params: { month },
    });
  }
}
