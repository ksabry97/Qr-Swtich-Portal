import { Component, effect, inject, OnInit } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  TableColumn,
  TableAction,
  QrTable,
} from '../../../../shared/components/qr-table/qr-table';
import { GlobalService } from '../../../../shared/services/global.service';
import { AddFee } from '../add-fee/add-fee';
import { QrModal } from '../../../../shared/components/qr-modal/qr-modal';
import { FeesService } from '../../services/fees.service';
import { TranslateModule } from '@ngx-translate/core';
import { SimulateFee } from '../simulate-fee/simulate-fee';
import { AuthService } from '../../../../shared/services/auth.service';
import { TableFilter } from '../../../../shared/components/table-filter/table-filter';
import { LookupData, LookupType } from '../../../../shared/core/interfaces';
import { FilterConfig } from '../../../../shared/components/dynamic-filter/dynamic-filter';

@Component({
  selector: 'app-fees-list',
  imports: [EntityHeader, QrTable, QrModal, TranslateModule, TableFilter],
  templateUrl: './fees-list.html',
  styleUrl: './fees-list.scss',
})
export class FeesList implements OnInit {
  globalServ = inject(GlobalService);
  feeServ = inject(FeesService);
  authServ = inject(AuthService);
  createModal = [AddFee, SimulateFee];
  isOpened = -1;
  viewMode = false;
  feeId = '';
  columns: TableColumn[] = [
    {
      field: 'name',
      header: 'fees.table.name',
      width: '100px',
      sortable: false,
    },
    { field: 'feeType', header: 'fees.table.type', sortable: false },
    {
      field: 'currency',
      header: 'fees.table.currency',
      sortable: false,
    },
    {
      field: 'effectiveFrom',
      header: 'fees.table.effective',
      sortable: false,
      template: 'date',
    },
  ];

  actions: TableAction[] = [];

  constructor() {
    effect(() => {
      this.globalServ.isSubmitted()
        ? this.getAllFees(this.pageIndex, this.pageSize)
        : '';
    });
  }
  fees = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  Fees: any;
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
  openModel(i: number) {
    this.viewMode = false;
    this.isOpened = i;
    this.globalServ.setModal(true);
  }
  ngOnInit(): void {
    this.getAllCurrencies();
    this.getAllFees(this.pageIndex, this.pageSize);
    this.globalServ.PermissionsPerModule.subscribe((value) => {
      this.Fees = value.Fees?.permissions;
      this.actions = [
        {
          label: 'users.actions.viewDetails',
          icon: 'eye',
          severity: 'info',
          disabled: !this.isAllowed(this.Fees?.ViewFee),
        },
        {
          label: 'fees.actions.simulate',
          icon: 'calculator',
          severity: 'warn',
          disabled: !this.isAllowed(this.Fees?.SimulateFee),
        },
      ];
    });
  }
  getAllFees(pageNumber: number, pageSize: number, filters: any = {}) {
    this.globalServ.setLoading(true);
    this.globalServ.isSubmitted.set(false);
    this.pageIndex = pageNumber;
    this.pageSize = pageSize;
    this.feeServ.getAllFees(pageNumber, pageSize, filters).subscribe({
      next: (data: any) => {
        this.fees = data?.data?.items[0]?.feeProfiles;
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
    switch (action.action.severity) {
      case 'info':
        this.openModel(0);
        this.viewMode = true;
        this.feeId = action.rowData.id;
        return;
      case 'warn':
        this.openModel(1);
        this.feeId = action.rowData.id;
        return;
    }
  }
  isAllowed(permission: string) {
    return this.authServ.hasPermission(permission);
  }
  filterTable(event: any) {
    this.getAllFees(this.pageIndex, this.pageSize, event);
  }
  getAllCurrencies() {
    this.globalServ.getAllCurrencies().subscribe({
      next: (data: any) => {
        const mappedData = data.data.map((item: any) => ({
          text: item.text,
          value: item.text,
        }));
        this.lookups[LookupType.Currency] = mappedData;
      },
    });
  }
}
