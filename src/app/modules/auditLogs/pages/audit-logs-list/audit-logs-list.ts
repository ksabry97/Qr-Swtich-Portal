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
import { ViewAudit } from '../view-audit/view-audit';
import { QrModal } from '../../../../shared/components/qr-modal/qr-modal';
import { AdditionalData } from '../../interfaces/audit';

@Component({
  selector: 'app-audit-logs-list',
  imports: [EntityHeader, QrTable, TranslateModule, CommonModule, QrModal],
  templateUrl: './audit-logs-list.html',
  styleUrl: './audit-logs-list.scss',
})
export class AuditLogsList implements OnInit {
  viewAuditCom = ViewAudit;
  auditServ = inject(AuditsService);
  globalServ = inject(GlobalService);
  pageIndex = 1;
  pageSize = 10;
  columns: TableColumn[] = [
    {
      field: 'occurredOnUtc',
      header: 'auditLogs.table.dateOfOccurance',
      sortable: false,
      template: 'date',
    },
    {
      field: 'userName',
      header: 'auditLogs.table.username',
      sortable: false,
    },
    {
      field: 'actionType',
      header: 'auditLogs.table.actionType',
      sortable: false,
    },
    {
      field: 'actionDetails',
      header: 'auditLogs.table.actionDetails',
      sortable: false,
    },
  ];

  actions: TableAction[] = [
    {
      label: 'transactions.actions.viewDetails',
      icon: 'eye',
      severity: 'info',
    },
  ];
  audits = [];
  total = 0;
  additionalData!: AdditionalData;
  ngOnInit(): void {
    this.getAllAudits(this.pageIndex, this.pageSize);
  }

  getAllAudits(pageNumber: number, pageSize: number) {
    this.globalServ.setLoading(true);
    this.pageIndex = pageNumber;
    this.auditServ.getAllAsudits(pageNumber, pageSize).subscribe({
      next: (data: any) => {
        this.audits = data.items;
        this.total = data.totalCount;
      },
      error: () => {
        this.globalServ.setLoading(false);
      },
      complete: () => {
        this.globalServ.setLoading(false);
      },
    });
  }

  viewAudit(event: any) {
    this.globalServ.setModal(true);

    this.additionalData = event?.rowData?.additionalData;
  }
}
