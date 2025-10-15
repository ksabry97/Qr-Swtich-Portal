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

@Component({
  selector: 'app-merchant-list',
  imports: [EntityHeader, QrTable, QrModal],
  templateUrl: './merchant-list.html',
  styleUrl: './merchant-list.scss',
})
export class MerchantList implements OnInit {
  globalServ = inject(GlobalService);
  merchantServ = inject(MerchantService);
  addMerchant = AddMerchant;
  columns: TableColumn[] = [
    { field: 'name', header: 'Name', width: '100px', sortable: false },
    { field: 'scheme', header: 'Scheme', sortable: false },
    {
      field: 'msisdn',
      header: 'msisdn',
      sortable: false,
    },
    { field: 'contactEmail', header: 'Email', sortable: false },
    { field: 'commercialRegNo', header: 'Commercial RegNo', sortable: false },
    {
      field: 'createdAt',
      header: 'Created On',
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
      label: 'Edit',
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
