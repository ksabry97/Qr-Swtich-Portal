import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { QrInputNumber } from '../qr-input-number/qr-input-number';
import { TranslateModule } from '@ngx-translate/core';
import { GlobalService } from '../../services/global.service';
import { SimulaterRes } from '../../core/interfaces';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-simulator',
  imports: [
    CommonModule,
    FormsModule,
    QrInputNumber,
    ReactiveFormsModule,
    TranslateModule,
    NzIconModule,
  ],
  templateUrl: './simulator.html',
  styleUrl: './simulator.scss',
})
export class Simulator {
  mssidn: number | null = null;
  loading = false;
  simulatorForm!: FormGroup;
  globalServ = inject(GlobalService);
  message = inject(NzMessageService);
  constructor(private fb: FormBuilder) {
    this.simulatorForm = this.fb.group({
      senderMsisdn: [],
      receiverMsisdn: [],
      amount: [],
      description: [],
    });
  }

  pay() {
    this.loading = true;
    let simulateBody = this.simulatorForm.value;
    let reqBody: SimulaterRes = {
      senderMsisdn: simulateBody?.senderMsisdn,
      amount: {
        value: simulateBody?.amount,
        currency: 'XOF',
      },
      description: simulateBody?.description,
      receiverMsisdn: simulateBody?.receiverMsisdn,
    };

    this.globalServ.simulatePay(reqBody).subscribe({
      next: (data: any) => {
        console.log(data);
        this.loading = false;

        switch (data?.body?.responseCode) {
          case '00000':
            this.message.success('paid successfully');
            break;
          case '10001':
            this.message.error('Invalid sender');
            break;
          case '10002':
            this.message.error('Invalid receiver');
            break;
          case '10012':
            this.message.error('Request Timeout');
            break;
          case '10008':
            this.message.error('Transaction Not Found');
            break;
          case '10011':
            this.message.error('System Error');
            break;
        }
      },
      error: (err) => {
        console.log(err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
