import { Component, inject, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  QrTable,
  TableAction,
  TableColumn,
} from '../../../../shared/components/qr-table/qr-table';
import { TransactionsService } from '../../services/transactions.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { ViewTransaction } from '../view-transaction/view-transaction';
import { QrModal } from '../../../../shared/components/qr-modal/qr-modal';
import { TableFilter } from '../../../../shared/components/table-filter/table-filter';
import { LookupData, LookupType } from '../../../../shared/core/interfaces';
import { FilterConfig } from '../../../../shared/components/dynamic-filter/dynamic-filter';
import { forkJoin, catchError, of } from 'rxjs';

@Component({
  selector: 'app-transactions-list',
  imports: [EntityHeader, QrTable, TranslateModule, QrModal, TableFilter],
  templateUrl: './transactions-list.html',
  styleUrl: './transactions-list.scss',
})
export class TransactionsList implements OnInit {
  transactionServ = inject(TransactionsService);
  globalServ = inject(GlobalService);
  view = ViewTransaction;
  columns: TableColumn[] = [
    {
      field: 'transactionDate',
      header: 'auditLogs.table.dateOfOccurance',
      sortable: false,
      template: 'date',
    },

    {
      field: 'senderMsisdn',
      header: 'transactions.table.senderMsisdn',
      sortable: false,
    },
    { field: 'amount', header: 'transactions.table.amount', sortable: false },
    {
      field: 'currency',
      header: 'transactions.table.currency',
      sortable: false,
    },
    {
      field: 'transactionType',
      header: 'transactions.table.transactionType',
      sortable: false,
    },
    { field: 'status', header: 'transactions.table.status', sortable: false },

    {
      field: 'receiverMsisdn',
      header: 'transactions.table.receiverMsisdn',
      sortable: false,
    },
  ];

  actions: TableAction[] = [
    {
      label: 'transactions.actions.viewDetails',
      icon: 'eye',
      severity: 'info',
    },
  ];
  transactionId = '';
  transactions = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  lookups: LookupData = {
    [LookupType.Unknown]: [],
    [LookupType.Country]: [],
    [LookupType.City]: [],
    [LookupType.Currency]: [],
    [LookupType.MerchantCategoryCode]: [],
    [LookupType.Merchant]: [],
    [LookupType.MerchantType]: [],
    [LookupType.IdentificationType]: [],
    [LookupType.FeeProfile]: [],
    [LookupType.Wallet]: [],
    [LookupType.Tenant]: [],
    [LookupType.Role]: [],
    [LookupType.Permission]: [],
  };
  filterConfigs: FilterConfig[] = [];
  ngOnInit(): void {
    forkJoin({
      wallets: this.globalServ.getWalletsLookup().pipe(
        catchError((err) => {
          return of([]);
        })
      ),
      tenants: this.globalServ.getAllTenantLookups().pipe(
        catchError((err) => {
          return of([]);
        })
      ),
    }).subscribe({
      next: (data: any) => {
        this.lookups[LookupType.Wallet] = data.wallets?.data;
        this.lookups[LookupType.Tenant] = data.tenants?.data;
      },
    });
    this.getAllCurrencies();
    setTimeout(() => {
      this.getAllTransactions(this.pageIndex, this.pageSize);
    }, 500);
  }
  getAllTransactions(pageIndex: number, pageSize: number, filters?: any) {
    this.globalServ.setLoading(true);
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.transactionServ
      .getAllTransactions(this.pageIndex, this.pageSize, filters)
      .subscribe({
        next: (data: any) => {
          this.transactions = data?.data?.transactions;

          this.filterConfigs = data?.data?.stringProperties.map(
            (el: { name: string; type: string; lookUpEnum: LookupType }) => {
              return {
                key: el.name,
                type: el.type,
                label: el.name,
                options: this.lookups[el.lookUpEnum],
              };
            }
          );
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
  openModel(action: any) {
    this.globalServ.setModal(true);
    this.transactionId = action.rowData.transactionId;
  }
  filterTable(event: any) {
    this.getAllTransactions(this.pageIndex, this.pageSize, event);
  }
  getAllCurrencies() {
    this.globalServ.getAllCurrencies().subscribe({
      next: (data: any) => {
        const mappedData = data.data.map((item: any) => ({
          text: item.text,
          value: item.text,
        }));
        this.lookups[LookupType.Currency] = mappedData;
      },
    });
  }
}
