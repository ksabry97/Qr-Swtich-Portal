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
import { FilterConfig } from '../../../../shared/components/dynamic-filter/dynamic-filter';
import { LookupData, LookupType } from '../../../../shared/core/interfaces';
import { forkJoin, catchError, of } from 'rxjs';

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
  filterConfigs: FilterConfig[] = [];
  merchants = [];
  Merchants: any;
  lookups: LookupData = {
    [LookupType.Unknown]: [],
    [LookupType.Country]: [],
    [LookupType.City]: [],
    [LookupType.Currency]: [],
    [LookupType.MerchantCategoryCode]: [],
    [LookupType.Merchant]: [],
    [LookupType.MerchantType]: [
      {
        text: 'Merchant',
        value: 0,
      },
      {
        text: 'Agent',
        value: 1,
      },
      {
        text: 'Biller',
        value: 2,
      },
      {
        text: 'Aggregator',
        value: 3,
      },
    ],
    [LookupType.IdentificationType]: [
      {
        text: 'Commercial Registration',
        value: 0,
      },
      {
        text: 'Service License Number',
        value: 1,
      },
      {
        text: 'Sole Proprietorship License',
        value: 2,
      },
      {
        text: 'National ID',
        value: 3,
      },
    ],
    [LookupType.FeeProfile]: [],
    [LookupType.Wallet]: [],
    [LookupType.Tenant]: [],
    [LookupType.Role]: [],
    [LookupType.Permission]: [],
  };
  constructor() {
    effect(() => {
      this.globalServ.isSubmitted()
        ? this.getAllMerchants(this.pageIndex, this.pageSize)
        : '';
    });
  }

  ngOnInit(): void {
    forkJoin({
      countries: this.globalServ.getAllCountries().pipe(
        catchError((err) => {
          return of([]);
        })
      ),
      mccs: this.globalServ.getMccs().pipe(
        catchError((err) => {
          return of([]);
        })
      ),
      fees: this.globalServ.getAllfeesLookups().pipe(
        catchError((err) => {
          return of([]);
        })
      ),
      wallets: this.globalServ.getWalletsLookup().pipe(
        catchError((err) => {
          return of([]);
        })
      ),
    }).subscribe({
      next: (data: any) => {
        this.lookups[LookupType.Country] = data.countries?.data;
        this.lookups[LookupType.MerchantCategoryCode] = data.mccs?.data;
        this.lookups[LookupType.FeeProfile] = data.fees?.data;
        this.lookups[LookupType.Wallet] = data.wallets.data;
      },
    });
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

  getAllMerchants(pageNumber: number, pageSize: number, filters?: any) {
    this.globalServ.setLoading(true);
    this.globalServ.isSubmitted.set(false);
    this.pageIndex = pageNumber;
    this.pageSize = pageSize;
    this.merchantServ.getAllMerchants(pageNumber, pageSize, filters).subscribe({
      next: (data: any) => {
        this.merchants = data?.data?.items[0]?.merchants;
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
        console.log(this.filterConfigs);
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

  filterTable(event: any) {
    this.getAllMerchants(this.pageIndex, this.pageSize, event);
  }
}
