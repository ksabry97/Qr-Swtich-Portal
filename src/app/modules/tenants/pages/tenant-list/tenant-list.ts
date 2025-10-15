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

@Component({
  selector: 'app-tenant-list',
  imports: [EntityHeader, QrTable, QrModal],
  templateUrl: './tenant-list.html',
  styleUrl: './tenant-list.scss',
})
export class TenantList implements OnInit {
  globalServ = inject(GlobalService);
  createTenant = AddTenant;
  columns: TableColumn[] = [
    { field: 'id', header: 'Tenant ID', width: '100px', sortable: false },
    { field: 'tenantName', header: 'Name', sortable: false },
    {
      field: 'tenantCode',
      header: 'Code',
      sortable: false,
    },
    { field: 'country', header: 'Country', sortable: false },
    { field: 'contactEmail', header: 'Email', sortable: false },
    { field: 'environment', header: 'Environment', sortable: false },
    { field: 'status', header: 'Status', sortable: false },
    {
      field: 'createdAt',
      header: 'Created On',
      sortable: false,
      template: 'date',
    },
  ];

  actions: TableAction[] = [
    {
      label: 'View Details',
      icon: 'eye',
      severity: 'info',
    },
  ];

  tenants = [];

  openModel() {
    this.globalServ.setModal(true);
  }

  constructor(private readonly tenantServ: TenantService) {
    effect(() => {
      this.globalServ.isSubmitted() ? this.getAllTenants() : '';
    });
  }

  ngOnInit(): void {
    this.getAllTenants();
  }

  getAllTenants() {
    this.tenantServ.getAllTenants().subscribe({
      next: (data: any) => {
        this.tenants = data.data;
      },
    });
  }
}
