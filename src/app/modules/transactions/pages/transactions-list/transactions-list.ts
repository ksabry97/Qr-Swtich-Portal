import { Component } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  QrTable,
  TableAction,
  TableColumn,
} from '../../../../shared/components/qr-table/qr-table';

@Component({
  selector: 'app-transactions-list',
  imports: [EntityHeader, QrTable],
  templateUrl: './transactions-list.html',
  styleUrl: './transactions-list.scss',
})
export class TransactionsList {
  columns: TableColumn[] = [
    { field: 'id', header: 'TimeStamp', width: '100px', sortable: false },
    { field: 'name', header: 'Merchant', sortable: false },
    {
      field: 'status',
      header: 'Wallet',
      sortable: false,
    },
    { field: 'country', header: 'Amount', sortable: false },
    { field: 'country', header: 'Reference/Txn ID', sortable: false },
  ];

  actions: TableAction[] = [
    {
      label: 'View Details',
      icon: 'eye',
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
}
