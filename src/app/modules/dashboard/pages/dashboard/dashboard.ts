import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { QrModal } from '../../../../shared/components/qr-modal/qr-modal';
import { AddTenant } from '../../../tenants/pages/add-tenant/add-tenant';
import { GlobalService } from '../../../../shared/services/global.service';
import { AddUser } from '../../../users/pages/add-user/add-user';
import { AddRole } from '../../../roles/pages/add-role/add-role';
import { LineChart } from '../../../../shared/components/line-chart/line-chart';
import { PieChart } from '../../../../shared/components/pie-chart/pie-chart';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, QrModal, LineChart, PieChart, TranslateModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  createModal = [AddTenant, AddUser, AddRole];
  isOpened = -1;
  globalServ = inject(GlobalService);
  Roles: any;
  Users: any;
  Tenants: any;
  items = [
    {
      label: 'navigation.tenants',
      count: 0,
      icon: '',
      color: 'rgb(182, 214, 52)',
    },
    {
      label: 'navigation.users',
      count: 0,
      icon: '',
      color: 'rgb(80, 112, 221)',
    },
    {
      label: 'navigation.transactions',
      count: 0,
      icon: '',
      color: 'rgb(182, 214, 52)',
    },
    {
      label: 'dashboard.revenue',
      count: 0,
      icon: '',
      color: 'rgb(80, 112, 221)',
    },
  ];

  openModel(i: number) {
    this.isOpened = i;
    this.globalServ.setModal(true);
  }

  ngOnInit(): void {
    this.getTenantsCount();
    this.getUsersCount();
    this.globalServ.PermissionsPerModule.subscribe((value) => {
      this.Tenants = value.Tenants?.permissions;
      this.Roles = value.Roles?.permissions;
      this.Users = value.Users?.permissions;
    });
  }

  getTenantsCount() {
    this.globalServ.getTenantsCount().subscribe({
      next: (data: any) => {
        this.items[0].count = data.data;
      },
    });
  }

  getUsersCount() {
    this.globalServ.getUsersCount().subscribe({
      next: (data: any) => {
        this.items[1].count = data.data;
      },
    });
  }

  isAllowed(permission: string) {
    return this.globalServ.usersPermission.includes(permission);
  }
}
