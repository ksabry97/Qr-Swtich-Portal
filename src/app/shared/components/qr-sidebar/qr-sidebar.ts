import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-qr-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './qr-sidebar.html',
  styleUrl: './qr-sidebar.scss',
})
export class QrSidebar {
  routes = [
    {
      label: 'Dashboard',
      route: 'dashboard',
    },
    {
      label: 'Tenants',
      route: 'tenants',
    },
    {
      label: 'Users',
      route: 'users',
    },
    {
      label: 'Roles',
      route: 'roles',
    },
    {
      label: 'Wallets',
      route: 'wallets',
    },
    {
      label: 'Merchants',
      route: 'merchants',
    },
    {
      label: 'Fees',
      route: 'fees',
    },
    {
      label: 'Transactions',
      route: 'transactions',
    },
    {
      label: 'Audit Logs',
      route: 'audit-logs',
    },
    {
      label: 'Login Audits',
      route: 'login-audits',
    },
  ];
}
