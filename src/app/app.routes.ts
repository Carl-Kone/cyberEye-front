import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LeakedCredentialsComponent } from './leaked-credentials/leaked-credentials.component';

export const routes: Routes = [
    {path: '', component: DashboardComponent},
    {path: 'leaked-credentials', component: LeakedCredentialsComponent},
];