import { Component } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  QrTable,
  TableColumn,
} from '../../../../shared/components/qr-table/qr-table';

@Component({
  selector: 'app-login-audits-list',
  imports: [EntityHeader, QrTable],
  templateUrl: './login-audits-list.html',
  styleUrl: './login-audits-list.scss',
})
export class LoginAuditsList {
  columns: TableColumn[] = [
    { field: 'id', header: 'Date & Time', width: '100px', sortable: false },
    { field: 'name', header: 'Username', sortable: false },
    {
      field: 'status',
      header: 'User Id',
      sortable: false,
    },
    { field: 'country', header: 'Outcome', sortable: false },
    { field: 'country', header: 'IP Address', sortable: false },
    { field: 'country', header: 'User Agent', sortable: false },
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
