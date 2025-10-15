import { Component } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  QrTable,
  TableColumn,
} from '../../../../shared/components/qr-table/qr-table';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login-audits-list',
  imports: [EntityHeader, QrTable, TranslateModule],
  templateUrl: './login-audits-list.html',
  styleUrl: './login-audits-list.scss',
})
export class LoginAuditsList {
  columns: TableColumn[] = [
    { field: 'id', header: 'loginAudits.table.dateTime', width: '100px', sortable: false },
    { field: 'name', header: 'loginAudits.table.username', sortable: false },
    {
      field: 'status',
      header: 'loginAudits.table.userId',
      sortable: false,
    },
    { field: 'country', header: 'loginAudits.table.outcome', sortable: false },
    { field: 'country', header: 'loginAudits.table.ipAddress', sortable: false },
    { field: 'country', header: 'loginAudits.table.userAgent', sortable: false },
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
