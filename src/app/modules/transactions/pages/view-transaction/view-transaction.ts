import { Component, inject, Input } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { GlobalService } from '../../../../shared/services/global.service';
import { TransactionsService } from '../../services/transactions.service';
import { CommonModule } from '@angular/common';
import { ModalHeader } from '../../../../shared/components/modal-header/modal-header';

@Component({
  selector: 'app-view-transaction',
  imports: [CommonModule, ModalHeader, TranslateModule],
  templateUrl: './view-transaction.html',
  styleUrl: './view-transaction.scss',
})
export class ViewTransaction {
  globalServ = inject(GlobalService);
  transactionServ = inject(TransactionsService);
  translate = inject(TranslateService);
  // transactionStatus = TransactionStatus;
  // status!: TransactionStatus;
  @Input() transactionId = '';
  transactionNo = '';
  data = [
    {
      label: 'transactions.table.transactionDate',
      value: 0,
      type: 'date',
    },
    {
      label: 'transactions.table.senderName',
      value: 0,
    },
    {
      label: 'transactions.table.senderMsisdn',
      value: 0,
    },
    {
      label: 'transactions.table.receiverName',
      value: 0,
    },
    {
      label: 'transactions.table.receiverMsisdn',
      value: 0,
    },
    {
      label: 'transactions.table.amount',
      value: 0,
    },
    {
      label: 'transactions.table.currency',
      value: 0,
    },
    {
      label: 'transactions.table.status',
      value: 0,
    },
    {
      label: 'transactions.table.transactionType',
      value: 0,
    },
    {
      label: 'transactions.table.transactionReference',
      value: 0,
    },
  ];

  ngOnInit(): void {
    this.getTransaction();
  }

  getTransaction() {
    this.transactionServ.getTransaction(this.transactionId).subscribe({
      next: (data: any) => {
        this.data[0].value = data?.data?.transactionDate;
        this.data[1].value = data?.data?.senderName;
        this.data[2].value = data?.data?.senderMsisdn;
        this.data[3].value = data?.data?.receiverName;
        this.data[4].value = data?.data?.receiverMsisdn;
        this.data[5].value = data?.data?.amount;
        this.data[6].value = data?.data?.currency;
        this.data[7].value = data?.data?.status;
        this.data[8].value = data?.data?.transactionType;
        this.data[9].value = data?.data?.transactionReference;
      },
    });
  }
}
