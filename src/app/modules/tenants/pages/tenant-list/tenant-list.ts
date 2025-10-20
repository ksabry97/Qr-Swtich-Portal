import { Component, effect, inject, OnInit } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  QrTable,
  TableAction,
  TableColumn,
} from '../../../../shared/components/qr-table/qr-table';
import { QrModal } from '../../../../shared/components/qr-modal/qr-modal';
import { GlobalService } from '../../../../shared/services/global.service';
import { AddTenant } from '../add-tenant/add-tenant';
import { TenantService } from '../../services/tenants.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tenant-list',
  imports: [EntityHeader, QrTable, QrModal, TranslateModule],
  templateUrl: './tenant-list.html',
  styleUrl: './tenant-list.scss',
})
export class TenantList implements OnInit {
  globalServ = inject(GlobalService);
  createTenant = AddTenant;
  viewMode = false;
  tenantId = '';
  columns: TableColumn[] = [
    { field: 'tenantName', header: 'tenants.table.name', sortable: false },
    {
      field: 'tenantCode',
      header: 'tenants.table.code',
      sortable: false,
    },
    { field: 'country', header: 'tenants.table.country', sortable: false },
    { field: 'contactEmail', header: 'tenants.table.email', sortable: false },
    {
      field: 'environment',
      header: 'tenants.table.environment',
      sortable: false,
    },
    { field: 'status', header: 'tenants.table.status', sortable: false },
    {
      field: 'createdAt',
      header: 'tenants.table.createdOn',
      sortable: false,
      template: 'date',
    },
  ];

  actions: TableAction[] = [
    {
      label: 'tenants.actions.viewDetails',
      icon: 'eye',
      severity: 'info',
    },
  ];

  tenants = [];

  openModel() {
    this.viewMode = false;
    this.globalServ.setModal(true);
  }

  constructor(
    private readonly tenantServ: TenantService,
    private message: NzMessageService
  ) {
    effect(() => {
      this.globalServ.isSubmitted() ? this.getAllTenants() : '';
    });
  }

  ngOnInit(): void {
    this.getAllTenants();
  }

  getAllTenants() {
    this.globalServ.setLoading(true);
    this.tenantServ.getAllTenants().subscribe({
      next: (data: any) => {
        this.tenants = data.data;
      },
      error: () => {
        this.globalServ.setLoading(false);
      },
      complete: () => {
        this.globalServ.setLoading(false);
      },
    });
  }

  callAction(action: any) {
    switch (action.action.severity) {
      case 'info':
        this.globalServ.setModal(true);
        this.viewMode = true;
        this.tenantId = action.rowData.id;
    }
  }
}
