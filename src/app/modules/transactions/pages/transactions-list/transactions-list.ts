import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
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
  imports: [EntityHeader, QrTable, TranslateModule],
  templateUrl: './transactions-list.html',
  styleUrl: './transactions-list.scss',
})
export class TransactionsList implements OnInit {
  transactionServ = inject(TransactionsService);
  globalServ = inject(GlobalService);
  columns: TableColumn[] = [
    {
      field: 'transactionId',
      header: 'transactions.table.transactionId',

      sortable: false,
    },
    {
      field: 'senderName',
      header: 'transactions.table.senderName',
      sortable: false,
    },
    {
      field: 'senderMsisdn',
      header: 'transactions.table.senderMsisdn',
      sortable: false,
    },
    { field: 'amount', header: 'transactions.table.amount', sortable: false },
    {
      field: 'currency',
      header: 'transactions.table.currency',
      sortable: false,
    },
    {
      field: 'transactionType',
      header: 'transactions.table.transactionType',
      sortable: false,
    },
    { field: 'status', header: 'transactions.table.status', sortable: false },
    {
      field: 'receiverName',
      header: 'transactions.table.receiverName',
      sortable: false,
    },
    {
      field: 'receiverMsisdn',
      header: 'transactions.table.receiverMsisdn',
      sortable: false,
    },
  ];

  actions: TableAction[] = [];

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
}
