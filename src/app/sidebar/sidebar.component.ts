import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  public title = 'cybereye';
  public menu = [
    { name: 'Fuite de données sensibles', link: '/app/dashboard', icon: 'dashboard' },
    { name: 'Systèmes non patchés et vulnérables', link: '/app/dashboard-custom', icon: 'view_quilt' },
    { name: 'Services exposés', link: '/app/dashboard', icon: 'dashboard' },
    { name: 'Portails non sécurisés', link: '/app/components', icon: 'developer_board' },
  ];

  selectedItemIndex: number | null = null;

  selectItem(index: number): void {
    this.selectedItemIndex = index;
  }
}
