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
