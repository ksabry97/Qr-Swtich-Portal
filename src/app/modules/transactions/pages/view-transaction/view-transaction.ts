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
      label: 'Transaction Date',
      value: 0,
      type: 'date',
    },
    {
      label: 'Sender Name',
      value: 0,
    },
    {
      label: 'Sender Msisdn',
      value: 0,
    },
    {
      label: 'Receiver Name',
      value: 0,
    },
    {
      label: 'Receiver Msisdn',
      value: 0,
    },
    {
      label: 'Amount',
      value: 0,
    },
    {
      label: 'Currency',
      value: 0,
    },
    {
      label: 'Status',
      value: 0,
    },
    {
      label: 'Transaction Type',
      value: 0,
    },
    {
      label: 'Transaction Reference',
      value: 0,
    },
  ];

  ngOnInit(): void {
    this.getTransaction();
  }

  getTransaction() {
    this.transactionServ.getTransaction(this.transactionId).subscribe({
      next: (data: any) => {
        this.transactionNo = data.data.transactionId;
        this.data[0].value = data.data.transactionDate;
        this.data[1].value = data.data.senderName;
        this.data[2].value = data.data.senderMsisdn;
        this.data[3].value = data.data.receiverName;
        this.data[4].value = data.data.receiverMsisdn;
        this.data[5].value = data.data.amount;
        this.data[6].value = data.data.currency;
        this.data[7].value = data.data.status;
        this.data[8].value = data.data.transactionType;
        this.data[9].value = data.data.transactionReference;
      },
    });
  }
}
