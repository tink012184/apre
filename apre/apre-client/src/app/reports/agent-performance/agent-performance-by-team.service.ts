import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TeamPerformanceRow {
  agent: string;
  score: number;
}

export interface TeamPerformanceDualRow {
  agent: string;
  customerSatisfaction: number;
  salesConversion: number;
}

@Injectable({ providedIn: 'root' })
export class AgentPerformanceService {
  private apiBase = 'http://localhost:3000/api/reports/agent-performance';

  constructor(private http: HttpClient) {}

  getTeams(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiBase}/teams`);
  }

  getTeamPerformance(team: string): Observable<TeamPerformanceRow[]> {
    return this.http.get<TeamPerformanceRow[]>(
      `${this.apiBase}/teams/${encodeURIComponent(team)}`,
    );
  }

  getTeamPerformanceDual(team: string): Observable<TeamPerformanceDualRow[]> {
    return this.http.get<TeamPerformanceDualRow[]>(
      `${this.apiBase}/teams/${encodeURIComponent(team)}/dual`,
    );
  }
}
