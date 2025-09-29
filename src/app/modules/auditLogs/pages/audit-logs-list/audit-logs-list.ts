import { Component } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  TableColumn,
  TableAction,
  QrTable,
} from '../../../../shared/components/qr-table/qr-table';

@Component({
  selector: 'app-audit-logs-list',
  imports: [EntityHeader, QrTable],
  templateUrl: './audit-logs-list.html',
  styleUrl: './audit-logs-list.scss',
})
export class AuditLogsList {
  columns: TableColumn[] = [
    { field: 'id', header: 'Date & Time', width: '100px', sortable: false },
    { field: 'name', header: 'User', sortable: false },
    {
      field: 'status',
      header: 'Action',
      sortable: false,
    },
    { field: 'country', header: 'Entity', sortable: false },
    { field: 'country', header: 'Entity ID', sortable: false },
    { field: 'country', header: 'IP Address', sortable: false },
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
