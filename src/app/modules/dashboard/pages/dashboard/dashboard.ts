import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { QrModal } from '../../../../shared/components/qr-modal/qr-modal';
import { AddTenant } from '../../../tenants/pages/add-tenant/add-tenant';
import { GlobalService } from '../../../../shared/services/global.service';
import { AddUser } from '../../../users/pages/add-user/add-user';
import { AddRole } from '../../../roles/pages/add-role/add-role';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, QrModal],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  createModal = [AddTenant, AddUser, AddRole];
  isOpened = -1;
  globalServ = inject(GlobalService);
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
  openModel(i: number) {
    this.isOpened = i;
    this.globalServ.setModal(true);
  }
}
