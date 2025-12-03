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
import { AuthService } from '../../../../shared/services/auth.service';
import { TableFilter } from '../../../../shared/components/table-filter/table-filter';

@Component({
  selector: 'app-tenant-list',
  imports: [EntityHeader, QrTable, QrModal, TranslateModule, TableFilter],
  templateUrl: './tenant-list.html',
  styleUrl: './tenant-list.scss',
})
export class TenantList implements OnInit {
  globalServ = inject(GlobalService);
  authServ = inject(AuthService);
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
      field: 'isActive',
      header: 'tenants.table.status',
      sortable: false,
      template: 'boolean',
    },
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
  Tenants: any;
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
    this.globalServ.PermissionsPerModule.subscribe((value) => {
      this.Tenants = value.Tenants?.permissions;
      this.actions = [
        {
          label: 'users.actions.viewDetails',
          icon: 'eye',
          severity: 'info',
          disabled: !this.isAllowed(this.Tenants?.ViewTenant),
        },
        {
          label: 'users.actions.deactivate',
          icon: 'lock',
          severity: 'danger',
          disabled: !this.isAllowed(this.Tenants?.EditTenant),
        },
      ];
    });
  }

  getAllTenants() {
    this.globalServ.setLoading(true);
    this.globalServ.isSubmitted.set(false);
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
  isAllowed(permission: string) {
    return this.authServ.hasPermission(permission);
  }
  activateTenant(event: any) {
    if (event.isActive) {
      this.tenantServ.deactivateTenant(event.id).subscribe({
        next: (data: any) => {
          this.message.success(data?.Message);
          this.getAllTenants();
        },
        error: (err) => {
          this.message.error(err?.error?.Message);
        },
      });
    } else {
      this.tenantServ.activateTenant(event.id).subscribe({
        next: (data: any) => {
          this.message.success(data?.Message);
          this.getAllTenants();
        },
        error: (err) => {
          this.message.error(err?.error?.Message);
        },
      });
    }
  }
}
