import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [],
  template: `
    <base-menu-link-item *ngIf="data.link || data.href" [data]="data"></base-menu-link-item>
    <base-submenu-item *ngIf="data.children" [data]="data"></base-submenu-item>
  `,
  styleUrl: './menu-item.component.scss'
})
export class MenuItemComponent {

}
