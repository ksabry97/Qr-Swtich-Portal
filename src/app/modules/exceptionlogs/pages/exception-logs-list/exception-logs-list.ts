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
      field: 'occurredOnUtc',
      header: 'auditLogs.table.dateOfOccurance',
      sortable: false,
      template: 'date',
    },
    {
      field: 'exceptionSource',
      header: 'transactions.table.transactionId',
      sortable: false,
    },
    {
      field: 'exceptionMessage',
      header: 'transactions.table.senderName',
      sortable: false,
    },
    {
      field: 'stackTrace',
      header: 'transactions.table.senderMsisdn',
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
          console.log(data);
          this.excepLogs = data?.items;
          this.total = data?.totalCount;
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
