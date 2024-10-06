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
    { name: 'Fuite de données sensibles', link: '/leaked-credentials', icon: 'dashboard' },
    { name: 'Systèmes non patchés et vulnérables', link: '/leaked-credentials', icon: 'view_quilt' },
    { name: 'Services exposés', link: '/leaked-credentials', icon: 'dashboard' },
    { name: 'Portails non sécurisés', link: '/leaked-credentials', icon: 'developer_board' },
  ];

  selectedItemIndex: number | null = null;

  selectItem(index: number): void {
    this.selectedItemIndex = index;
  }
}
