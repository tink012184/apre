/**
 * Author: Professor Krasso
 * Date: 8/8/2024
 * File: dashboard.component.ts
 * Description: dashboard component for the MEAN Stack Application
 */

import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ChartComponent } from '../shared/chart/chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ChartComponent],
  template: `
    <h2>Dashboard</h2>
    <div class="dashboard">
      <div class="charts-container">
        <div class="card">
          <!-- ✅ CHANGED: show spinner while Sales report loads -->
          @if (loadingSalesData) {
            <div class="spinner"></div>
          } @else {
            <app-chart
              [type]="'bar'"
              [label]="'Sales Data'"
              [data]="salesData"
              [labels]="salesRegions"
            ></app-chart>
          }
        </div>

        <div class="card">
          <!-- ✅ CHANGED: show spinner while Agent Performance report loads -->
          @if (loadingAgentPerformanceData) {
            <div class="spinner"></div>
          } @else {
            <app-chart
              [type]="'line'"
              [label]="'Agent Performance'"
              [data]="agentPerformanceData"
              [labels]="agentNames"
            ></app-chart>
          }
        </div>
      </div>

      <div class="charts-container">
        <div class="card">
          <!-- ✅ CHANGED: show spinner while Customer Feedback report loads -->
          @if (loadingCustomerFeedbackData) {
            <div class="spinner"></div>
          } @else {
            <app-chart
              [type]="'pie'"
              [label]="'Customer Feedback'"
              [data]="customerFeedbackData"
              [labels]="feedbackTypes"
            ></app-chart>
          }
        </div>

        <div class="card">
          <!-- ✅ CHANGED: show spinner while Report Types report loads -->
          @if (loadingReportTypesData) {
            <div class="spinner"></div>
          } @else {
            <app-chart
              [type]="'doughnut'"
              [label]="'Report Types'"
              [data]="reportCounts"
              [labels]="reportTypes"
            ></app-chart>
          }
        </div>
      </div>

      <div class="dashboard__table-container">
        <!-- ✅ CHANGED: show spinner while table loads -->
        @if (loadingAgentFeedbackData) {
          <div class="spinner"></div>
        } @else {
          <table class="table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Call Duration</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              @for (data of tableData; track data) {
                <tr>
                  <td>{{ data.agent }}</td>
                  <td>{{ data.callDuration }}</td>
                  <td>{{ data.customerFeedback }}</td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  `,
  styles: `
    .dashboard {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .charts-container {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      flex-wrap: wrap;
    }

    .card {
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(50% - 10px);
      height: 300px;
      padding: 10px;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    .card app-chart {
      width: 100%;
      height: 100%;
    }

    .dashboard__table-container {
      width: 100%;
    }

    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-left-color: #000;
      border-radius: 50%;
      width: 48px;
      height: 48px;
      animation: spin 1s linear infinite;
      margin: auto;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `,
})
export class DashboardComponent implements OnInit {
  tableData: any[] = [];

  loadingSalesData = true;

  // ✅ CHANGED: add loading flags for each report
  loadingAgentPerformanceData = true;
  loadingCustomerFeedbackData = true;
  loadingReportTypesData = true;
  loadingAgentFeedbackData = true;

  salesData: number[] = [];
  salesRegions: string[] = [];
  agentPerformanceData: any[] = [];
  agentNames: string[] = [];
  customerFeedbackData: any[] = [];
  feedbackTypes: string[] = [];
  reportCounts: number[] = [];
  reportTypes: string[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.loadSalesData();
    this.loadAgentPerformanceData();
    this.loadCustomerFeedbackData();
    this.loadReportTypesData();
    this.loadAgentFeedbackData();
  }

  loadSalesData() {
    // ✅ CHANGED: ensure loading starts true for this request
    this.loadingSalesData = true;

    this.http.get(`${environment.apiBaseUrl}/dashboard/sales-data`).subscribe({
      next: (data: any) => {
        this.salesData = data.map((d: any) => d.totalAmount);
        this.salesRegions = data.map((d: any) => d.region);
      },
      // ✅ CHANGED: stop spinner when request completes or errors
      error: () => (this.loadingSalesData = false),
      complete: () => (this.loadingSalesData = false),
    });
  }

  loadAgentPerformanceData() {
    // ✅ CHANGED
    this.loadingAgentPerformanceData = true;

    this.http
      .get(`${environment.apiBaseUrl}/dashboard/agent-performance`)
      .subscribe({
        next: (data: any) => {
          this.agentPerformanceData = data.map(
            (d: any) => d.averagePerformance,
          );
          this.agentNames = data.map((d: any) => d.name);
        },
        // ✅ CHANGED
        error: () => (this.loadingAgentPerformanceData = false),
        complete: () => (this.loadingAgentPerformanceData = false),
      });
  }

  loadCustomerFeedbackData() {
    // ✅ CHANGED
    this.loadingCustomerFeedbackData = true;

    this.http
      .get(`${environment.apiBaseUrl}/dashboard/customer-feedback`)
      .subscribe({
        next: (data: any) => {
          this.feedbackTypes = data.map((d: any) => d.feedbackType);
          this.customerFeedbackData = data.map(
            (d: any) => d.averagePerformance,
          );
        },
        // ✅ CHANGED
        error: () => (this.loadingCustomerFeedbackData = false),
        complete: () => (this.loadingCustomerFeedbackData = false),
      });
  }

  loadReportTypesData() {
    // ✅ CHANGED
    this.loadingReportTypesData = true;

    this.http
      .get(`${environment.apiBaseUrl}/dashboard/report-types`)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.reportTypes = data.reportTypes;
          this.reportCounts = data.reportCounts;
        },
        // ✅ CHANGED
        error: () => (this.loadingReportTypesData = false),
        complete: () => (this.loadingReportTypesData = false),
      });
  }

  loadAgentFeedbackData() {
    // ✅ CHANGED
    this.loadingAgentFeedbackData = true;

    this.http
      .get(`${environment.apiBaseUrl}/dashboard/agent-feedback`)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.tableData = data;
        },
        // ✅ CHANGED
        error: () => (this.loadingAgentFeedbackData = false),
        complete: () => (this.loadingAgentFeedbackData = false),
      });
  }
}
