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
@Component({
  selector: 'app-wallet-list',
  imports: [EntityHeader, QrTable, QrModal, TranslateModule],
  templateUrl: './wallet-list.html',
  styleUrl: './wallet-list.scss',
})
export class WalletList implements OnInit {
  globalServ = inject(GlobalService);
  walletServ = inject(WalletsService);
  addWallet = AddWallet;
  viewMode = false;
  walletId = '';
  total = 0;
  pageIndex = 0;
  pageSize = 10;
  columns: TableColumn[] = [
    { field: 'name', header: 'wallets.table.walletName', sortable: false },
    {
      field: 'environment',
      header: 'wallets.table.environment',
      sortable: false,
    },
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

  wallets = [];
  constructor() {
    effect(() => {
      this.globalServ.isSubmitted() ? this.getAllWallets(1, 10) : '';
    });
  }
  ngOnInit(): void {
    this.getAllWallets(this.pageIndex, this.pageSize);
  }
  openModel() {
    this.viewMode = false;
    this.globalServ.setModal(true);
  }

  getAllWallets(pageNumber: number, pageSize: number) {
    this.globalServ.setLoading(true);
    this.pageIndex = pageNumber;
    this.walletServ.getAllWallets(pageNumber, pageSize).subscribe({
      next: (data: any) => {
        this.wallets = data.data.items;
        this.total = data.data.totalCount;
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
}
