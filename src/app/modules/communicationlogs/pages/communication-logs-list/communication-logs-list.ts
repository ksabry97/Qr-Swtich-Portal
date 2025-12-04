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
import { CommunicationLogsService } from '../../services/commlogs.service';
import { TableFilter } from '../../../../shared/components/table-filter/table-filter';

@Component({
  selector: 'app-communication-logs-list',
  imports: [EntityHeader, QrTable, TranslateModule, TableFilter],
  templateUrl: './communication-logs-list.html',
  styleUrl: './communication-logs-list.scss',
})
export class CommunicationLogsList {
  CommLogsServ = inject(CommunicationLogsService);
  globalServ = inject(GlobalService);
  view = ViewTransaction;
  columns: TableColumn[] = [
    {
      field: 'occurredOnUtc',
      header: 'Occurred On UTC',
      sortable: false,
      template: 'date',
    },
    {
      field: 'serviceName',
      header: 'Service Name',
      sortable: false,
    },
    {
      field: 'internalRequest',
      header: 'Internal Request',
      sortable: false,
    },
    {
      field: 'internalResponse',
      header: 'Internal Response',
      sortable: false,
    },
    {
      field: 'externalRequest',
      header: 'External Request',
      sortable: false,
    },
    {
      field: 'externalResponse',
      header: 'External Response',
      sortable: false,
    },
  ];

  actions: TableAction[] = [];
  commLogs = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.getAllcommLogs(this.pageIndex, this.pageSize);
  }
  getAllcommLogs(pageIndex: number, pageSize: number) {
    this.globalServ.setLoading(true);
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.CommLogsServ.getAllCommLogs(this.pageIndex, this.pageSize).subscribe({
      next: (data: any) => {
        console.log(data);
        this.commLogs = data?.items;
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
