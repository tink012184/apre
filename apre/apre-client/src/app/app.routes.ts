/**
 * Author: Professor Krasso
 * Date: 8/8/2024
 * File: app.routes.ts
 * Description: Application routes
 */

// Import the necessary modules
import { Routes } from '@angular/router';
import { DemoComponent } from './demo/demo.component';
import { SigninComponent } from './security/signin/signin.component';
import { authGuard } from './security/auth.guard';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SupportComponent } from './support/support.component';
import { FaqComponent } from './faq/faq.component';
import { UsersComponent } from './admin/user-management/users/users.component';
import { UserDetailsComponent } from './admin/user-management/user-details/user-details.component';
import { UserManagementComponent } from './admin/user-management/user-management.component';
import { UserCreateComponent } from './admin/user-management/user-create/user-create.component';
import { SalesByRegionComponent } from './reports/sales/sales-by-region/sales-by-region.component';
import { SalesComponent } from './reports/sales/sales.component';
import { AgentPerformanceComponent } from './reports/agent-performance/agent-performance.component';
import { CallDurationByDateRangeComponent } from './reports/agent-performance/call-duration-by-date-range/call-duration-by-date-range.component';
import { ChannelRatingByMonthComponent } from './reports/customer-feedback/channel-rating-by-month/channel-rating-by-month.component';
import { CustomerFeedbackComponent } from './reports/customer-feedback/customer-feedback.component';
import { SalesByRegionTabularComponent } from './reports/sales/sales-by-region-tabular/sales-by-region-tabular.component';
<<<<<<< HEAD
import { SalesByMonthComponent } from './reports/sales/sales-by-month/sales-by-month.component';
=======
>>>>>>> 4a157f7b7cdbe68441b146a79284a2c913eddb3c

// Export user-management routes
export const userManagementRoutes: Routes = [
  {
    path: '',
    redirectTo: 'users',
<<<<<<< HEAD
    pathMatch: 'full',
  },
  {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'users/new',
    component: UserCreateComponent,
  },
  {
    path: 'users/:id',
    component: UserDetailsComponent,
  },
];
=======
    pathMatch: 'full'
  },
  {
    path: 'users',
    component: UsersComponent
  },
  {
    path: 'users/new',
    component: UserCreateComponent
  },
  {
    path: 'users/:id',
    component: UserDetailsComponent
  }
]
>>>>>>> 4a157f7b7cdbe68441b146a79284a2c913eddb3c

// Sales reports routes
export const salesReportRoutes: Routes = [
  {
    path: 'sales-by-region',
<<<<<<< HEAD
    component: SalesByRegionComponent,
  },
  {
    path: 'sales-by-region-tabular',
    component: SalesByRegionTabularComponent,
  },
  {
    path: 'sales-by-month',
    component: SalesByMonthComponent,
  },
=======
    component: SalesByRegionComponent
  },
  {
    path: 'sales-by-region-tabular',
    component: SalesByRegionTabularComponent
  }
>>>>>>> 4a157f7b7cdbe68441b146a79284a2c913eddb3c
];

// Agent performance routes
export const agentPerformanceRoutes: Routes = [
  {
    path: 'call-duration-by-date-range',
<<<<<<< HEAD
    component: CallDurationByDateRangeComponent,
  },
=======
    component: CallDurationByDateRangeComponent
  }
>>>>>>> 4a157f7b7cdbe68441b146a79284a2c913eddb3c
];

// Customer feedback routes
export const customerFeedbackRoutes: Routes = [
  {
    path: 'channel-rating-by-month',
<<<<<<< HEAD
    component: ChannelRatingByMonthComponent,
  },
=======
    component: ChannelRatingByMonthComponent
  }
>>>>>>> 4a157f7b7cdbe68441b146a79284a2c913eddb3c
];

// Export the routes
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
<<<<<<< HEAD
        component: DashboardComponent,
      },
      {
        path: 'demo',
        component: DemoComponent,
      },
      {
        path: 'support',
        component: SupportComponent,
      },
      {
        path: 'faq',
        component: FaqComponent,
=======
        component: DashboardComponent
      },
      {
        path: 'demo',
        component: DemoComponent
      },
      {
        path: 'support',
        component: SupportComponent
      },
      {
        path: 'faq',
        component: FaqComponent
>>>>>>> 4a157f7b7cdbe68441b146a79284a2c913eddb3c
      },
      {
        path: 'user-management',
        component: UserManagementComponent,
<<<<<<< HEAD
        children: userManagementRoutes,
=======
        children: userManagementRoutes
>>>>>>> 4a157f7b7cdbe68441b146a79284a2c913eddb3c
      },
      {
        path: 'reports/sales',
        component: SalesComponent,
<<<<<<< HEAD
        children: salesReportRoutes,
=======
        children: salesReportRoutes
>>>>>>> 4a157f7b7cdbe68441b146a79284a2c913eddb3c
      },
      {
        path: 'reports/agent-performance',
        component: AgentPerformanceComponent,
<<<<<<< HEAD
        children: agentPerformanceRoutes,
=======
        children: agentPerformanceRoutes
>>>>>>> 4a157f7b7cdbe68441b146a79284a2c913eddb3c
      },
      {
        path: 'reports/customer-feedback',
        component: CustomerFeedbackComponent,
<<<<<<< HEAD
        children: customerFeedbackRoutes,
      },
    ],
    canActivate: [authGuard],
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
=======
        children: customerFeedbackRoutes
      }
    ],
    canActivate: [authGuard]
  },
  {
    path: 'signin',
    component: SigninComponent
  }
>>>>>>> 4a157f7b7cdbe68441b146a79284a2c913eddb3c
];
