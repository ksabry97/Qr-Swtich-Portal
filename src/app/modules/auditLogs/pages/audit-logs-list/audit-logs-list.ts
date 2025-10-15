import { Component, inject, OnInit } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  TableColumn,
  TableAction,
  QrTable,
} from '../../../../shared/components/qr-table/qr-table';
import { AuditsService } from '../../services/auditlogs.service';
import { GlobalService } from '../../../../shared/services/global.service';

@Component({
  selector: 'app-audit-logs-list',
  imports: [EntityHeader, QrTable],
  templateUrl: './audit-logs-list.html',
  styleUrl: './audit-logs-list.scss',
})
export class AuditLogsList implements OnInit {
  auditServ = inject(AuditsService);
  globalServ = inject(GlobalService);
  columns: TableColumn[] = [
    { field: 'Id', header: 'ID', width: '200px', sortable: false },
    {
      field: 'OccurredOnUtc',
      header: 'Date Of Occurance',
      sortable: false,
      template: 'date',
    },
    {
      field: 'TenantId',
      header: 'Tenant ID',
      sortable: false,
    },
    { field: 'TenantCode', header: 'Tenant Code', sortable: false },
    { field: 'StatusCode', header: 'Status Code', sortable: false },
  ];

  actions: TableAction[] = [
    {
      label: 'View Details',
      icon: 'eye',
      severity: 'info',
    },
  ];
  audits = [];
  total = 0;
  ngOnInit(): void {
    this.getAllAudits(1, 10);
  }

  getAllAudits(pageNumber: number, pageSize: number) {
    this.globalServ.setLoading(true);
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
