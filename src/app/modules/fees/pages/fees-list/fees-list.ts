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
import { SimulateFee } from '../simulate-fee/simulate-fee';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-fees-list',
  imports: [EntityHeader, QrTable, QrModal, TranslateModule],
  templateUrl: './fees-list.html',
  styleUrl: './fees-list.scss',
})
export class FeesList implements OnInit {
  globalServ = inject(GlobalService);
  feeServ = inject(FeesService);
  authServ = inject(AuthService);
  createModal = [AddFee, SimulateFee];
  isOpened = -1;
  viewMode = false;
  feeId = '';
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

  actions: TableAction[] = [];

  constructor() {
    effect(() => {
      this.globalServ.isSubmitted()
        ? this.getAllFees(this.pageIndex, this.pageSize)
        : '';
    });
  }
  fees = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  Fees: any;
  openModel(i: number) {
    this.viewMode = false;
    this.isOpened = i;
    this.globalServ.setModal(true);
  }
  ngOnInit(): void {
    this.getAllFees(this.pageIndex, this.pageSize);
    this.globalServ.PermissionsPerModule.subscribe((value) => {
      this.Fees = value.Fees?.permissions;
      this.actions = [
        {
          label: 'users.actions.viewDetails',
          icon: 'eye',
          severity: 'info',
          disabled: !this.isAllowed(this.Fees?.ViewFee),
        },
        {
          label: 'fees.actions.simulate',
          icon: 'calculator',
          severity: 'warn',
          disabled: !this.isAllowed(this.Fees?.SimulateFee),
        },
      ];
    });
  }
  getAllFees(pageNumber: number, pageSize: number) {
    this.globalServ.setLoading(true);
    this.globalServ.isSubmitted.set(false);
    this.pageIndex = pageNumber;
    this.pageSize = pageSize;
    this.feeServ.getAllFees(pageNumber, pageSize).subscribe({
      next: (data: any) => {
        this.fees = data?.data?.items;
        this.total = data?.data?.totalCount;
      },
      error: () => {
        this.globalServ.setLoading(false);
      },
      complete: () => {
        this.globalServ.setLoading(false);
      },
    });
  }
  callAction(action: any) {
    switch (action.action.severity) {
      case 'info':
        this.openModel(0);
        this.viewMode = true;
        this.feeId = action.rowData.id;
        return;
      case 'warn':
        this.openModel(1);
        this.feeId = action.rowData.id;
        return;
    }
  }
  isAllowed(permission: string) {
    return this.authServ.hasPermission(permission);
  }
}
