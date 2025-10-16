import { Component, effect, inject, OnInit } from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-fees-list',
  imports: [EntityHeader, QrTable, QrModal, TranslateModule],
  templateUrl: './fees-list.html',
  styleUrl: './fees-list.scss',
})
export class FeesList implements OnInit {
  globalServ = inject(GlobalService);
  feeServ = inject(FeesService);
  addFee = AddFee;
  columns: TableColumn[] = [
    {
      field: 'name',
      header: 'fees.table.name',
      width: '100px',
      sortable: false,
    },
    { field: 'feeType', header: 'fees.table.type', sortable: false },
    {
      field: 'currency',
      header: 'fees.table.currency',
      sortable: false,
    },
    {
      field: 'effectiveFrom',
      header: 'fees.table.effective',
      sortable: false,
      template: 'date',
    },
  ];

  actions: TableAction[] = [
    {
      label: 'fees.actions.viewDetails',
      icon: 'eye',
      severity: 'info',
    },
    {
      label: 'fees.actions.simulate',
      icon: 'calculator',
      severity: 'info',
      disabled: true,
    },
  ];

  constructor() {
    effect(() => {
      this.globalServ.isSubmitted() ? this.getAllFees(1, 10) : '';
    });
  }
  fees = [];
  openModel() {
    this.globalServ.setModal(true);
  }
  ngOnInit(): void {
    this.getAllFees(1, 10);
  }
  getAllFees(pageNumber: number, pageSize: number) {
    this.globalServ.setLoading(true);
    this.feeServ.getAllFees(pageNumber, pageSize).subscribe({
      next: (data: any) => {
        this.fees = data.data;
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
