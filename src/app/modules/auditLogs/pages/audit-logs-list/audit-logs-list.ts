import { Component, inject, OnInit } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  TableColumn,
  TableAction,
  QrTable,
} from '../../../../shared/components/qr-table/qr-table';
import { AuditsService } from '../../services/auditlogs.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit-logs-list',
  imports: [EntityHeader, QrTable, TranslateModule, CommonModule],
  templateUrl: './audit-logs-list.html',
  styleUrl: './audit-logs-list.scss',
})
export class AuditLogsList implements OnInit {
  auditServ = inject(AuditsService);
  globalServ = inject(GlobalService);
  pageIndex = 1;
  pageSize = 10;
  columns: TableColumn[] = [
    {
      field: 'OccurredOnUtc',
      header: 'auditLogs.table.dateOfOccurance',
      sortable: false,
      template: 'date',
    },
    {
      field: 'TenantId',
      header: 'auditLogs.table.tenantId',
      sortable: false,
    },
    {
      field: 'TenantCode',
      header: 'auditLogs.table.tenantCode',
      sortable: false,
    },
    {
      field: 'StatusCode',
      header: 'auditLogs.table.statusCode',
      sortable: false,
    },
  ];

  actions: TableAction[] = [];
  audits = [];
  total = 0;
  ngOnInit(): void {
    this.getAllAudits(this.pageIndex, this.pageSize);
  }

  getAllAudits(pageNumber: number, pageSize: number) {
    this.globalServ.setLoading(true);
    this.pageIndex = pageNumber;
    this.auditServ.getAllAsudits(pageNumber, pageSize).subscribe({
      next: (data: any) => {
        this.audits = data.items;
        this.total = data.total;
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
