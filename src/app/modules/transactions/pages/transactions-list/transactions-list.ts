import { Component, inject, OnInit } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  QrTable,
  TableAction,
  TableColumn,
} from '../../../../shared/components/qr-table/qr-table';
import { TransactionsService } from '../../services/transactions.service';
import { GlobalService } from '../../../../shared/services/global.service';

@Component({
  selector: 'app-transactions-list',
  imports: [EntityHeader, QrTable],
  templateUrl: './transactions-list.html',
  styleUrl: './transactions-list.scss',
})
export class TransactionsList implements OnInit {
  transactionServ = inject(TransactionsService);
  globalServ = inject(GlobalService);
  columns: TableColumn[] = [
    {
      field: 'transactionId',
      header: 'Transaction Id',

      sortable: false,
    },
    { field: 'senderName', header: 'Sender Name', sortable: false },
    {
      field: 'senderMsisdn',
      header: 'Sender Msisdn',
      sortable: false,
    },
    { field: 'amount', header: 'Amount', sortable: false },
    { field: 'currency', header: 'Currency', sortable: false },
    { field: 'transactionType', header: 'Transaction Type', sortable: false },
    { field: 'status', header: 'Status', sortable: false },
    { field: 'receiverName', header: 'Receiver Name', sortable: false },
    { field: 'receiverMsisdn', header: 'Receiver Msisdn', sortable: false },
  ];

  actions: TableAction[] = [
    {
      label: 'View Details',
      icon: 'eye',
      severity: 'info',
    },
  ];

  transactions = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.getAllTransactions(this.pageIndex, this.pageSize);
  }
  getAllTransactions(pageIndex: number, pageSize: number) {
    this.globalServ.setLoading(true);
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.transactionServ
      .getAllTransactions(this.pageIndex, this.pageSize)
      .subscribe({
        next: (data: any) => {
          this.transactions = data.data;
        },
        error: () => {
          this.globalServ.setLoading(false);
        },
        complete: () => {
          this.globalServ.setLoading(false);
        },
      });
  }
}
