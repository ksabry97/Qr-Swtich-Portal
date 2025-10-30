import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../services/global.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-qr-sidebar',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './qr-sidebar.html',
  styleUrl: './qr-sidebar.scss',
})
export class QrSidebar implements OnInit {
  globalServ = inject(GlobalService);
  routes: any[] = [];

  ngOnInit(): void {
    this.globalServ.PermissionsPerModule.pipe(
      filter((value) => Object.keys(value || {}).length > 0)
    ).subscribe((value) => {
      this.routes = [
        {
          label: 'navigation.dashboard',
          route: 'dashboard',
          isDisabled: false,
        },
        {
          label: 'navigation.tenants',
          route: 'tenants',
          isDisabled: !this.isAllowed(value?.Tenants?.permissions?.ViewTenant),
        },
        {
          label: 'navigation.users',
          route: 'users',
          isDisabled: false,
        },
        {
          label: 'navigation.roles',
          route: 'roles',
          isDisabled: false,
        },
        {
          label: 'navigation.wallets',
          route: 'wallets',
          isDisabled: false,
        },
        {
          label: 'navigation.merchants',
          route: 'merchants',
          isDisabled: false,
        },
        {
          label: 'navigation.fees',
          route: 'fees',
          isDisabled: false,
        },
        {
          label: 'navigation.auditLogs',
          route: 'audit-logs',
          isDisabled: false,
        },
      ];
    });
  }
  isAllowed(permission: string) {
    return this.globalServ.usersPermission.subscribe((value) => {
      return value.includes(permission);
    });
  }
}
