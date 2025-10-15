import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
export class Dashboard {
  createModal = [AddTenant, AddUser, AddRole];
  isOpened = -1;
  globalServ = inject(GlobalService);
  items = [
    {
      label: 'navigation.tenants',
      count: 30,
      icon: '',
    },
    {
      label: 'navigation.users',
      count: 30,
      icon: '',
    },
    {
      label: 'navigation.transactions',
      count: 30,
      icon: '',
    },
    {
      label: 'dashboard.revenue',
      count: 30,
      icon: '',
    },
  ];
  openModel(i: number) {
    this.isOpened = i;
    this.globalServ.setModal(true);
  }
}
