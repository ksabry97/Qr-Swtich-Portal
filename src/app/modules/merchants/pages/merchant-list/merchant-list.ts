import { Component, effect, inject, OnInit } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  QrTable,
  TableAction,
  TableColumn,
} from '../../../../shared/components/qr-table/qr-table';
import { QrModal } from '../../../../shared/components/qr-modal/qr-modal';
import { GlobalService } from '../../../../shared/services/global.service';
import { AddMerchant } from '../add-merchant/add-merchant';
import { MerchantService } from '../../services/merchants.service';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { TableFilter } from '../../../../shared/components/table-filter/table-filter';

@Component({
  selector: 'app-merchant-list',
  imports: [EntityHeader, QrTable, QrModal, TranslateModule, TableFilter],
  templateUrl: './merchant-list.html',
  styleUrl: './merchant-list.scss',
})
export class MerchantList implements OnInit {
  globalServ = inject(GlobalService);
  merchantServ = inject(MerchantService);
  authServ = inject(AuthService);
  addMerchant = AddMerchant;
  viewMode = false;
  editMode = false;
  merchantId = '';
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  columns: TableColumn[] = [
    {
      field: 'name',
      header: 'merchants.table.name',
      width: '100px',
      sortable: false,
    },
    { field: 'scheme', header: 'merchants.table.scheme', sortable: false },
    {
      field: 'msisdn',
      header: 'merchants.table.msisdn',
      sortable: false,
    },
    { field: 'contactEmail', header: 'merchants.table.email', sortable: false },
    {
      field: 'commercialRegNo',
      header: 'merchants.table.commercialRegNo',
      sortable: false,
    },
    {
      field: 'createdAt',
      header: 'merchants.table.createdOn',
      sortable: false,
      template: 'date',
    },
  ];

  actions: TableAction[] = [
    {
      label: 'merchants.actions.viewDetails',
      icon: 'eye',
      severity: 'info',
    },
    {
      label: 'merchants.actions.edit',
      icon: 'edit',
      severity: 'warn',
    },
  ];

  merchants = [];
  Merchants: any;
  constructor() {
    effect(() => {
      this.globalServ.isSubmitted()
        ? this.getAllMerchants(this.pageIndex, this.pageSize)
        : '';
    });
  }

  ngOnInit(): void {
    this.getAllMerchants(this.pageIndex, this.pageSize);
    this.globalServ.PermissionsPerModule.subscribe((value) => {
      this.Merchants = value.Merchants?.permissions;
      this.actions = [
        {
          label: 'users.actions.viewDetails',
          icon: 'eye',
          severity: 'info',
          disabled: !this.isAllowed(this.Merchants?.ViewMerchant),
        },
        {
          label: 'users.actions.edit',
          icon: 'edit',
          severity: 'warn',
          disabled: !this.isAllowed(this.Merchants?.EditMerchant),
        },
      ];
    });
  }
  openModel() {
    this.viewMode = false;
    this.editMode = false;
    this.globalServ.setModal(true);
  }

  getAllMerchants(pageNumber: number, pageSize: number) {
    this.globalServ.setLoading(true);
    this.globalServ.isSubmitted.set(false);
    this.pageIndex = pageNumber;
    this.pageSize = pageSize;
    this.merchantServ.getAllMerchants(pageNumber, pageSize).subscribe({
      next: (data: any) => {
        this.merchants = data?.data?.items[0]?.merchants;
        this.total = data?.data?.totalCount;
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
    this.viewMode = false;
    this.editMode = false;
    switch (action.action.severity) {
      case 'info':
        this.globalServ.setModal(true);
        this.viewMode = true;
        this.merchantId = action.rowData.id;
        return;
      case 'warn':
        this.globalServ.setModal(true);
        this.editMode = true;
        this.merchantId = action.rowData.id;
        return;
    }
  }
  isAllowed(permission: string) {
    return this.authServ.hasPermission(permission);
  }
}
