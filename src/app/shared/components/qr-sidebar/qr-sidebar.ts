import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../services/global.service';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-qr-sidebar',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './qr-sidebar.html',
  styleUrl: './qr-sidebar.scss',
})
export class QrSidebar implements OnInit {
  globalServ = inject(GlobalService);
  authServ = inject(AuthService);
  routes: any[] = [];
  isActive = 0;
  ngOnInit(): void {
    this.isActive = Number(localStorage.getItem('activeTab') ?? 0);
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
          isDisabled: !this.isAllowed(value?.Users?.permissions?.ViewUser),
        },
        {
          label: 'navigation.roles',
          route: 'roles',
          isDisabled: !this.isAllowed(value?.Roles?.permissions?.ViewRole),
        },
        {
          label: 'navigation.wallets',
          route: 'wallets',
          isDisabled: !this.isAllowed(value?.Wallets?.permissions?.ViewWallet),
        },
        {
          label: 'navigation.merchants',
          route: 'merchants',
          isDisabled: !this.isAllowed(
            value?.Merchants?.permissions?.ViewMerchant
          ),
        },
        {
          label: 'navigation.fees',
          route: 'fees',
          isDisabled: !this.isAllowed(value?.Fees?.permissions?.ViewFee),
        },
        {
          label: 'navigation.transactions',
          route: 'transactions',
          isDisabled: !this.isAllowed(
            value?.Transactions?.permissions?.ViewTransaction
          ),
        },
        {
          label: 'navigation.auditLogs',
          route: 'audit-logs',
          isDisabled: !this.isAllowed(
            value?.AuditLogs?.permissions?.ViewAllLogs
          ),
        },
        {
          label: 'navigation.commlogs',
          route: 'communication-logs',
          isDisabled: !this.isAllowed(
            value?.AuditLogs?.permissions?.ViewAllLogs
          ),
        },
        {
          label: 'navigation.excplogs',
          route: 'exception-logs',
          isDisabled: !this.isAllowed(
            value?.AuditLogs?.permissions?.ViewAllLogs
          ),
        },
      ];
    });
  }

  isAllowed(permission: string) {
    return this.authServ.hasPermission(permission);
  }
  setActive(i: number) {
    localStorage.setItem('activeTab', String(i));
    this.isActive = i;
  }
}
