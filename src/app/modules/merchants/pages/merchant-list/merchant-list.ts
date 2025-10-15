import { Component, effect, inject, OnInit } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  QrTable,
  TableAction,
  TableColumn,
} from '../../../../shared/components/qr-table/qr-table';
import { QrModal } from '../../../../shared/components/qr-modal/qr-modal';
import { GlobalService } from '../../../../shared/services/global.service';
import { AddMerchant } from '../add-merchant/add-merchant';
import { MerchantService } from '../../services/merchants.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-merchant-list',
  imports: [EntityHeader, QrTable, QrModal, TranslateModule],
  templateUrl: './merchant-list.html',
  styleUrl: './merchant-list.scss',
})
export class MerchantList implements OnInit {
  globalServ = inject(GlobalService);
  merchantServ = inject(MerchantService);
  addMerchant = AddMerchant;
  columns: TableColumn[] = [
    { field: 'name', header: 'merchants.table.name', width: '100px', sortable: false },
    { field: 'scheme', header: 'merchants.table.scheme', sortable: false },
    {
      field: 'msisdn',
      header: 'merchants.table.msisdn',
      sortable: false,
    },
    { field: 'contactEmail', header: 'merchants.table.email', sortable: false },
    { field: 'commercialRegNo', header: 'merchants.table.commercialRegNo', sortable: false },
    {
      field: 'createdAt',
      header: 'merchants.table.createdOn',
      sortable: false,
      template: 'date',
    },
  ];

  actions: TableAction[] = [
    {
      label: 'merchants.actions.viewDetails',
      icon: 'eye',
      severity: 'info',
    },
    {
      label: 'merchants.actions.edit',
      icon: 'edit',
      severity: 'info',
    },
  ];

  merchants = [];
  constructor() {
    effect(() => {
      this.globalServ.isSubmitted() ? this.getAllMerchants(1, 10) : '';
    });
  }

  ngOnInit(): void {
    this.getAllMerchants(1, 10);
  }
  openModel() {
    this.globalServ.setModal(true);
  }

  getAllMerchants(pageNumber: number, pageSize: number) {
    this.globalServ.setLoading(true);
    this.merchantServ.getAllMerchants(pageNumber, pageSize).subscribe({
      next: (data: any) => {
        this.merchants = data.data;
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
