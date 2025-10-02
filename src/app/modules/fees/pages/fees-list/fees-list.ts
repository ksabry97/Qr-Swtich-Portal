import { Component, inject } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  TableColumn,
  TableAction,
  QrTable,
} from '../../../../shared/components/qr-table/qr-table';
import { GlobalService } from '../../../../shared/services/global.service';
import { AddFee } from '../add-fee/add-fee';
import { QrModal } from '../../../../shared/components/qr-modal/qr-modal';

@Component({
  selector: 'app-fees-list',
  imports: [EntityHeader, QrTable, QrModal],
  templateUrl: './fees-list.html',
  styleUrl: './fees-list.scss',
})
export class FeesList {
  globalServ = inject(GlobalService);
  addFee = AddFee;
  columns: TableColumn[] = [
    { field: 'id', header: 'Name', width: '100px', sortable: false },
    { field: 'name', header: 'Type', sortable: false },
    {
      field: 'status',
      header: 'Currency',
      sortable: false,
    },
    { field: 'country', header: 'Effective', sortable: false },
  ];

  actions: TableAction[] = [
    {
      label: 'View Details',
      icon: 'eye',
      severity: 'info',
    },
    {
      label: 'Simulate',
      icon: 'calculator',
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
    {
      id: 280119,
      name: 'LightBoxV3Bank',
      status: false,
      scheme: 'Union Pay',
      terminals: 12,
      country: 'UAE',
    },
    {
      id: 280119,
      name: 'LightBoxV3Bank',
      status: false,
      scheme: 'Union Pay',
      terminals: 12,
      country: 'UAE',
    },
  ];
  openModel() {
    this.globalServ.setModal(true);
  }
}
