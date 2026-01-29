import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { catchError, of, switchMap } from 'rxjs';

import {
  AgentPerformanceService,
  TeamPerformanceDualRow,
} from '../agent-performance-by-team.service';
import { ChartComponent } from '../../../shared/chart/chart.component';

type Vm =
  | { state: 'loading' }
  | {
      state: 'ready';
      teams: string[];
      selectedTeam: string;
      rows: TeamPerformanceDualRow[];
    }
  | { state: 'error'; message: string };

@Component({
  selector: 'app-agent-performance-team',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartComponent],
  template: `
    <section class="page">
      <header class="page__header">
        <h2>Agent Performance by Team</h2>
        <p class="muted">Performance score per agent by metric.</p>
      </header>

      <div class="controls" *ngIf="vm.state !== 'error'">
        <label>
          Team:
          <select
            class="select"
            [(ngModel)]="selectedTeam"
            (ngModelChange)="onTeamChange($event)"
          >
            <option *ngFor="let team of teams" [value]="team">
              {{ team }}
            </option>
          </select>
        </label>
      </div>

      <div *ngIf="vm.state === 'loading'" class="status loading">
        Loading agent performance...
      </div>

      <div *ngIf="vm.state === 'error'" class="status error">
        {{ vm.message }}
      </div>

      <div *ngIf="vm.state === 'ready'" class="chart-wrapper">
        <app-chart
          [title]="'Performance – ' + selectedTeam"
          [labels]="chartLabels"
          [datasets]="datasets"
          [type]="'bar'"
        >
        </app-chart>
      </div>
    </section>
  `,
  styles: [
    `
      .page {
        padding: 1rem;
      }

      .page__header {
        margin-bottom: 1rem;
      }

      .page__header h2 {
        margin: 0;
      }

      .muted {
        opacity: 0.75;
        font-size: 0.9rem;
      }

      .controls {
        margin: 1rem 0;
        display: flex;
        gap: 1rem;
        align-items: center;
      }

      .select {
        margin-left: 0.5rem;
        padding: 0.4rem 0.6rem;
        border-radius: 0.4rem;
        border: 1px solid #ccc;
        background: #fff;
      }

      .status {
        padding: 1rem;
        border-radius: 0.5rem;
        margin-top: 1rem;
      }

      .status.loading {
        background: rgba(0, 0, 0, 0.03);
      }

      .status.error {
        border: 1px solid rgba(255, 0, 0, 0.4);
        color: #b00020;
        background: rgba(255, 0, 0, 0.05);
      }

      .chart-wrapper {
        margin-top: 2rem;
      }
    `,
  ],
})
export class AgentPerformanceTeamComponent implements OnInit {
  vm: Vm = { state: 'loading' };

  teams: string[] = [];
  selectedTeam = '';
  rows: TeamPerformanceDualRow[] = [];

  chartLabels: string[] = [];
  chartData: number[] = [];

  datasets: { label: string; data: number[] }[] = [];

  constructor(private svc: AgentPerformanceService) {}

  ngOnInit(): void {
    console.log('Agent performance array:', this.rows);
    this.loadTeams();
  }

  private loadTeams(): void {
    this.vm = { state: 'loading' };

    this.svc
      .getTeams()
      .pipe(
        switchMap((teams) => {
          this.teams = teams ?? [];
          this.selectedTeam = this.teams[0] ?? '';

          if (!this.selectedTeam) {
            return of([]);
          }

          return this.svc.getTeamPerformanceDual(this.selectedTeam);
        }),
        catchError(() => {
          this.vm = {
            state: 'error',
            message: 'Failed to load agent performance data',
          };
          return of(null);
        }),
      )
      .subscribe((rows) => {
        if (rows) this.setReady(rows);
      });
  }

  onTeamChange(team: string): void {
    this.selectedTeam = team;
    this.vm = { state: 'loading' };

    this.svc
      .getTeamPerformanceDual(team)
      .pipe(
        catchError(() => {
          this.vm = {
            state: 'error',
            message: 'Failed to load agent performance data',
          };
          return of(null);
        }),
      )
      .subscribe((rows) => {
        if (rows) this.setReady(rows);
      });
  }

  private setReady(rows: TeamPerformanceDualRow[]): void {
    this.rows = rows ?? [];
    this.chartLabels = this.rows.map((r) => r.agent);

    this.datasets = [
      {
        label: 'Customer Satisfaction',
        data: this.rows.map((r) => r.customerSatisfaction),
      },
      {
        label: 'Sales Conversion',
        data: this.rows.map((r) => r.salesConversion),
      },
    ];

    this.vm = {
      state: 'ready',
      teams: this.teams,
      selectedTeam: this.selectedTeam,
      rows: this.rows as any,
    };
  }
}
