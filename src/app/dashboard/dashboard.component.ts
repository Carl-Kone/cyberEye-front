import { Component } from '@angular/core';
import { CredentialLeaksComponent } from '../charts/credential-leaks/credential-leaks.component';
import { AllExpiredComponent } from '../charts/all-expired/all-expired.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CredentialLeaksComponent,
    AllExpiredComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
