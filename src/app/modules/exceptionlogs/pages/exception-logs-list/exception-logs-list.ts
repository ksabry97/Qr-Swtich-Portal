import { Component, inject } from '@angular/core';
import {
  TableColumn,
  TableAction,
  QrTable,
} from '../../../../shared/components/qr-table/qr-table';
import { GlobalService } from '../../../../shared/services/global.service';
import { ViewTransaction } from '../../../transactions/pages/view-transaction/view-transaction';

import { TranslateModule } from '@ngx-translate/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import { ExceptionLogsService } from '../../services/exceplogs.service';
import { TableFilter } from '../../../../shared/components/table-filter/table-filter';

@Component({
  selector: 'app-exception-logs-list',
  imports: [EntityHeader, QrTable, TranslateModule, TableFilter],
  templateUrl: './exception-logs-list.html',
  styleUrl: './exception-logs-list.scss',
})
export class ExceptionLogsList {
  excepLogsServ = inject(ExceptionLogsService);
  globalServ = inject(GlobalService);
  view = ViewTransaction;
  columns: TableColumn[] = [
    {
      field: 'transactionDate',
      header: 'auditLogs.table.dateOfOccurance',
      sortable: false,
      template: 'date',
    },
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
  excepLogs = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.getAllExcepLogs(this.pageIndex, this.pageSize);
  }
  getAllExcepLogs(pageIndex: number, pageSize: number) {
    this.globalServ.setLoading(true);
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.excepLogsServ
      .getAllExcepLogs(this.pageIndex, this.pageSize)
      .subscribe({
        next: (data: any) => {
          this.excepLogs = data?.data?.transactions;
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
