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
import { FilterConfig } from '../../../../shared/components/dynamic-filter/dynamic-filter';
import { LookupData, LookupType } from '../../../../shared/core/interfaces';

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
  total = 0;
  pageIndex = 1;
  pageSize = 10;
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
  lookups: LookupData = {
    [LookupType.Unknown]: [],
    [LookupType.Country]: [],
    [LookupType.City]: [],
    [LookupType.Currency]: [],
    [LookupType.MerchantCategoryCode]: [],
    [LookupType.Merchant]: [],
    [LookupType.MerchantType]: [],
    [LookupType.IdentificationType]: [],
    [LookupType.FeeProfile]: [],
    [LookupType.Wallet]: [],
    [LookupType.Tenant]: [],
    [LookupType.Role]: [],
    [LookupType.Permission]: [],
  };
  filterConfigs: FilterConfig[] = [];
  openModel() {
    this.viewMode = false;
    this.globalServ.setModal(true);
  }

  constructor(
    private readonly tenantServ: TenantService,
    private message: NzMessageService
  ) {
    effect(() => {
      this.globalServ.isSubmitted()
        ? this.getAllTenants(this.pageIndex, this.pageSize)
        : '';
    });
  }

  ngOnInit(): void {
    this.getAllCountries();
    this.getAllTenants(this.pageIndex, this.pageSize);
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

  getAllTenants(pageNumber: number, pageSize: number, filters?: any) {
    this.globalServ.setLoading(true);
    this.globalServ.isSubmitted.set(false);
    this.pageIndex = pageNumber;
    this.pageSize = pageSize;
    this.tenantServ.getAllTenants(pageNumber, pageSize, filters).subscribe({
      next: (data: any) => {
        this.tenants = data?.data?.items[0]?.tenants;
        this.total = data?.data?.totalCount;
        this.filterConfigs = data?.data?.items[0]?.stringProperties.map(
          (el: { name: string; type: string; lookUpEnum: LookupType }) => {
            return {
              key: el.name,
              type: el.type,
              label: el.name,
              options: this.lookups[el.lookUpEnum],
            };
          }
        );
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
          this.getAllTenants(this.pageIndex, this.pageSize);
        },
        error: (err) => {
          this.message.error(err?.error?.Message);
        },
      });
    } else {
      this.tenantServ.activateTenant(event.id).subscribe({
        next: (data: any) => {
          this.message.success(data?.Message);
          this.getAllTenants(this.pageIndex, this.pageSize);
        },
        error: (err) => {
          this.message.error(err?.error?.Message);
        },
      });
    }
  }

  filterTable(event: any) {
    this.getAllTenants(this.pageIndex, this.pageSize, event);
  }

  getAllCountries() {
    this.globalServ.getAllCountries().subscribe({
      next: (data: any) => {
        this.lookups[LookupType.Country] = data?.data;
      },
    });
  }
}
