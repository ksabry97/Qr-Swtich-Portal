import { Component, effect, inject, OnInit } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  QrTable,
  TableAction,
  TableColumn,
} from '../../../../shared/components/qr-table/qr-table';
import { QrModal } from '../../../../shared/components/qr-modal/qr-modal';
import { GlobalService } from '../../../../shared/services/global.service';
import { AddWallet } from '../add-wallet/add-wallet';
import { WalletsService } from '../../services/wallets.service';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../../shared/services/auth.service';
import { TableFilter } from '../../../../shared/components/table-filter/table-filter';
import { LookupData, LookupType } from '../../../../shared/core/interfaces';
import { FilterConfig } from '../../../../shared/components/dynamic-filter/dynamic-filter';
@Component({
  selector: 'app-wallet-list',
  imports: [EntityHeader, QrTable, QrModal, TranslateModule, TableFilter],
  templateUrl: './wallet-list.html',
  styleUrl: './wallet-list.scss',
})
export class WalletList implements OnInit {
  globalServ = inject(GlobalService);
  walletServ = inject(WalletsService);
  authServ = inject(AuthService);
  addWallet = AddWallet;
  viewMode = false;
  walletId = '';
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  columns: TableColumn[] = [
    { field: 'name', header: 'wallets.table.walletName', sortable: false },

    { field: 'baseUrl', header: 'wallets.table.baseUrl', sortable: false },
    {
      field: 'maxConnections',
      header: 'wallets.table.maxConnections',
      sortable: false,
    },
    {
      field: 'lastHealthCheck',
      header: 'wallets.table.lastHealthCheck',
      sortable: false,
      template: 'date',
    },
  ];

  actions: TableAction[] = [
    {
      label: 'wallets.actions.viewDetails',
      icon: 'eye',
      severity: 'info',
    },
  ];
  lookups: LookupData = {
    [LookupType.Unknown]: [],
    [LookupType.Country]: [],
    [LookupType.City]: [],
    [LookupType.Currency]: [],
    [LookupType.MerchantCategoryCode]: [],
    [LookupType.Merchant]: [],
    [LookupType.MerchantType]: [
      {
        text: 'Wallet',
        value: 0,
      },
      {
        text: 'Bank',
        value: 1,
      },
    ],
    [LookupType.IdentificationType]: [],
    [LookupType.FeeProfile]: [],
    [LookupType.Wallet]: [],
    [LookupType.Tenant]: [],
    [LookupType.Role]: [],
    [LookupType.Permission]: [],
  };
  filterConfigs: FilterConfig[] = [];
  wallets = [];
  Wallets: any;
  constructor() {
    effect(() => {
      this.globalServ.isSubmitted() ? this.getAllWallets(1, 10) : '';
    });
  }
  ngOnInit(): void {
    this.getAllWallets(this.pageIndex, this.pageSize);
    this.globalServ.PermissionsPerModule.subscribe((value) => {
      this.Wallets = value.Wallets?.permissions;
      this.actions = [
        {
          label: 'users.actions.viewDetails',
          icon: 'eye',
          severity: 'info',
          disabled: !this.isAllowed(this.Wallets?.ViewWallet),
        },
      ];
    });
  }
  openModel() {
    this.viewMode = false;
    this.globalServ.setModal(true);
  }

  getAllWallets(pageNumber: number, pageSize: number, filters?: any) {
    this.globalServ.setLoading(true);
    this.globalServ.isSubmitted.set(false);
    this.pageIndex = pageNumber;
    this.walletServ.getAllWallets(pageNumber, pageSize, filters).subscribe({
      next: (data: any) => {
        this.wallets = data?.data?.items[0]?.wallets;
        this.total = data.data.totalCount;

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
    this.viewMode = false;
    switch (action.action.severity) {
      case 'info':
        this.globalServ.setModal(true);
        this.viewMode = true;
        this.walletId = action.rowData.id;
        return;
    }
  }
  isAllowed(permission: string) {
    return this.authServ.hasPermission(permission);
  }
  filterTable(event: any) {
    this.getAllWallets(this.pageIndex, this.pageSize, event);
  }
}
