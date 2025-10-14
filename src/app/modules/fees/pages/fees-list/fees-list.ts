import { Component, inject, OnInit } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  TableColumn,
  TableAction,
  QrTable,
} from '../../../../shared/components/qr-table/qr-table';
import { GlobalService } from '../../../../shared/services/global.service';
import { AddFee } from '../add-fee/add-fee';
import { QrModal } from '../../../../shared/components/qr-modal/qr-modal';
import { FeesService } from '../../services/fees.service';

@Component({
  selector: 'app-fees-list',
  imports: [EntityHeader, QrTable, QrModal],
  templateUrl: './fees-list.html',
  styleUrl: './fees-list.scss',
})
export class FeesList implements OnInit {
  globalServ = inject(GlobalService);
  feeServ = inject(FeesService);
  addFee = AddFee;
  columns: TableColumn[] = [
    { field: 'name', header: 'Name', width: '100px', sortable: false },
    { field: 'feeType', header: 'Type', sortable: false },
    {
      field: 'currency',
      header: 'Currency',
      sortable: false,
    },
    {
      field: 'effectiveFrom',
      header: 'Effective',
      sortable: false,
      template: 'date',
    },
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

  fees = [];
  openModel() {
    this.globalServ.setModal(true);
  }
  ngOnInit(): void {
    this.getAllFees(1, 10);
  }
  getAllFees(pageNumber: number, pageSize: number) {
    this.feeServ.getAllFees(pageNumber, pageSize).subscribe({
      next: (data: any) => {
        this.fees = data.data;
      },
    });
  }
}
