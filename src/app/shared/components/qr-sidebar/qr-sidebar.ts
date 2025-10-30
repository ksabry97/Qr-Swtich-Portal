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
      this.globalServ.usersPermission.subscribe((perm) => {
        this.routes = [
          {
            label: 'navigation.dashboard',
            route: 'dashboard',
            isDisabled: false,
          },
          {
            label: 'navigation.tenants',
            route: 'tenants',
            isDisabled: !perm.includes(value?.Tenants?.permissions?.ViewTenant),
          },
          {
            label: 'navigation.users',
            route: 'users',
            isDisabled: !perm.includes(value?.Users?.permissions?.ViewUser),
          },
          {
            label: 'navigation.roles',
            route: 'roles',
            isDisabled: !perm.includes(value?.Roles?.permissions?.ViewRole),
          },
          {
            label: 'navigation.wallets',
            route: 'wallets',
            isDisabled: !perm.includes(value?.Wallets?.permissions?.ViewWallet),
          },
          {
            label: 'navigation.merchants',
            route: 'merchants',
            isDisabled: !perm.includes(
              value?.Merchants?.permissions?.ViewMerchant
            ),
          },
          {
            label: 'navigation.fees',
            route: 'fees',
            isDisabled: !perm.includes(value?.Fees?.permissions?.ViewFee),
          },
          {
            label: 'navigation.auditLogs',
            route: 'audit-logs',
            isDisabled: !perm.includes(
              value?.AuditLogs?.permissions?.ViewAllLogs
            ),
          },
        ];
      });
    });
  }
}
