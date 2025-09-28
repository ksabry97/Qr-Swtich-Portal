import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  items = [
    {
      label: 'Tenants',
      count: 30,
      icon: '',
    },
    {
      label: 'Users',
      count: 30,
      icon: '',
    },
    {
      label: 'Transactions',
      count: 30,
      icon: '',
    },
    {
      label: 'Revenue',
      count: 30,
      icon: '',
    },
  ];
}
