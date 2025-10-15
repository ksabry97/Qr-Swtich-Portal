import { Component, inject, OnInit } from '@angular/core';
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
@Component({
  selector: 'app-wallet-list',
  imports: [EntityHeader, QrTable, QrModal],
  templateUrl: './wallet-list.html',
  styleUrl: './wallet-list.scss',
})
export class WalletList implements OnInit {
  globalServ = inject(GlobalService);
  walletServ = inject(WalletsService);
  addWallet = AddWallet;
  columns: TableColumn[] = [
    { field: 'id', header: 'ID', width: '100px', sortable: false },
    { field: 'name', header: 'Wallet Name', sortable: false },
    {
      field: 'environment',
      header: 'Environment',
      sortable: false,
    },
    { field: 'baseUrl', header: 'Base URL', sortable: false },
    { field: 'maxConnections', header: 'Max Connections', sortable: false },
    {
      field: 'lastHealthCheck',
      header: 'Last Health Check',
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
    {
      label: 'Test Connection',
      icon: 'cloud-sync',
      severity: 'info',
    },
  ];

  wallets = [];
  ngOnInit(): void {
    this.getAllWallets(1, 10);
  }
  openModel() {
    this.globalServ.setModal(true);
  }

  getAllWallets(pageNumber: number, pageSize: number) {
    this.walletServ.getAllWallets(pageNumber, pageSize).subscribe({
      next: (data: any) => {
        this.wallets = data.data;
      },
    });
  }
}
