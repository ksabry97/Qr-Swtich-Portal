import { Component, inject } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  QrTable,
  TableAction,
  TableColumn,
} from '../../../../shared/components/qr-table/qr-table';
import { QrModal } from '../../../../shared/components/qr-modal/qr-modal';
import { GlobalService } from '../../../../shared/services/global.service';
import { AddWallet } from '../add-wallet/add-wallet';
@Component({
  selector: 'app-wallet-list',
  imports: [EntityHeader, QrTable, QrModal],
  templateUrl: './wallet-list.html',
  styleUrl: './wallet-list.scss',
})
export class WalletList {
  globalServ = inject(GlobalService);
  addWallet = AddWallet;
  columns: TableColumn[] = [
    { field: 'id', header: 'Wallet Name', width: '100px', sortable: false },
    { field: 'name', header: 'Type', sortable: false },
    {
      field: 'status',
      header: 'Environment',
      sortable: false,
    },
    { field: 'country', header: 'Base URL', sortable: false },
    { field: 'country', header: 'Status', sortable: false },
    { field: 'country', header: 'Created On', sortable: false },
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

  banks = [
    {
      id: 280122,
      name: 'WE Bank',
      status: true,
      scheme: 'Visa',
      terminals: 145,
      country: 'Egypt',
    },
    {
      id: 280121,
      name: 'VodaBank',
      status: true,
      scheme: 'Mastercard',
      terminals: 89,
      country: 'Egypt',
    },
    {
      id: 280120,
      name: 'ADCB',
      status: true,
      scheme: 'Visa',
      terminals: 234,
      country: 'UAE',
    },
  ];
  openModel() {
    this.globalServ.setModal(true);
  }
}
