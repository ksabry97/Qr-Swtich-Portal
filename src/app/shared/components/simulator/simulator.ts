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

import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QrRes } from '../../core/interfaces';
import { QRCodeComponent } from 'angularx-qrcode';
@Component({
  selector: 'app-simulator',
  imports: [
    CommonModule,
    FormsModule,
    QrInputNumber,
    ReactiveFormsModule,
    TranslateModule,
    NzIconModule,
    QRCodeComponent,
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
  elementType: 'url' | 'img' | 'canvas' | 'svg' = 'svg';
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H' = 'M';
  qrValue =
    '00020101021126510020com.qrswitch.schemeA01122010000000040207SchemeB520400005303XOF5406110.005905eslam6007senegal62100806string630474F5';
  constructor(private fb: FormBuilder) {
    this.simulatorForm = this.fb.group({
      msisdn: [],
      amount: [],
      description: [],
    });
  }

  pay() {
    this.loading = true;
    let simulateBody = this.simulatorForm.value;
    let reqBody: QrRes = {
      msisdn: simulateBody.msisdn,
      amount: simulateBody.amount,
      isStatic: true,
      purpose: simulateBody.description,
    };

    this.globalServ.generateQr(reqBody).subscribe({
      next: (data: any) => {
        this.loading = false;
        if (data?.body.responseCode === '00000') {
          this.message.success(data?.body?.responseDescription);
        } else {
          this.message.error(data?.body?.responseDescription);
        }
      },
      error: (err) => {
        this.message.error(err.error.message);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
