import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-qr-sidebar',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './qr-sidebar.html',
  styleUrl: './qr-sidebar.scss',
})
export class QrSidebar {
  routes = [
    {
      label: 'navigation.dashboard',
      route: 'dashboard',
    },
    {
      label: 'navigation.tenants',
      route: 'tenants',
    },
    {
      label: 'navigation.users',
      route: 'users',
    },
    {
      label: 'navigation.roles',
      route: 'roles',
    },
    {
      label: 'navigation.wallets',
      route: 'wallets',
    },
    {
      label: 'navigation.merchants',
      route: 'merchants',
    },
    {
      label: 'navigation.fees',
      route: 'fees',
    },
    // {
    //   label: 'navigation.transactions',
    //   route: 'transactions',
    // },
    {
      label: 'navigation.auditLogs',
      route: 'audit-logs',
    },
    // {
    //   label: 'navigation.loginAudits',
    //   route: 'login-audits',
    // },
  ];
}
