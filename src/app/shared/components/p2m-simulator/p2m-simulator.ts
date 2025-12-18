import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { QRCodeComponent } from 'angularx-qrcode';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '../../services/global.service';
import { QrInputNumber } from '../qr-input-number/qr-input-number';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-p2m-simulator',
  imports: [
    CommonModule,
    FormsModule,
    QrInputNumber,
    ReactiveFormsModule,
    TranslateModule,
    NzIconModule,
    QRCodeComponent,
  ],
  templateUrl: './p2m-simulator.html',
  styleUrl: './p2m-simulator.scss',
})
export class P2mSimulator implements OnInit {
  mssidn: number | null = null;
  loading = false;
  simulatorForm!: FormGroup;
  payForm!: FormGroup;
  payMForm!: FormGroup;
  globalServ = inject(GlobalService);
  message = inject(NzMessageService);
  activeRoute = inject(ActivatedRoute);
  elementType: 'url' | 'img' | 'canvas' | 'svg' = 'svg';
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H' = 'M';
  qrValue = '';
  openPayForm = false;
  hasAmount = false;
  isM2m = false;
  constructor(private fb: FormBuilder) {
    this.simulatorForm = this.fb.group({
      walletAcqID: [],
      msisdn: [],
      merID: [],
      amount: ['', Validators.min(0)],
      description: [],
      merchantName: [],
      merchantCity: [],
      merchantScheme: [],
      countryCode: [],
      currencyCode: ['952'],
      mcc: [],
    });
    this.payForm = this.fb.group({
      senderMsisdn: [],
      qrString: [],
      amount: ['', Validators.min(0)],
    });
    this.payMForm = this.fb.group({
      senderMerchantId: [''],
      senderWalletAcqId: [null],
      qrString: [],
      amount: ['', Validators.min(0)],
    });
  }
  hasSenderMssidn = false;
  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((value) => {
      this.simulatorForm.patchValue({ walletAcqID: value['walletId'] });
      this.simulatorForm.patchValue({ merID: value['merId'] });
      this.simulatorForm.patchValue({ msisdn: value['mssidn'] });
      this.payForm.patchValue({ senderMsisdn: value['senderMssidn'] });
      this.hasSenderMssidn = value['senderMssidn'];
      this.simulatorForm.patchValue({ merchantName: value['merchantName'] });
      this.simulatorForm.patchValue({ merchantCity: value['merchantCity'] });
      this.simulatorForm.patchValue({
        merchantScheme: value['merchantScheme'],
      });

      this.simulatorForm.patchValue({ countryCode: value['countryCode'] });
      this.simulatorForm.patchValue({ mcc: value['mcc'] });
      value['amount'] ? (this.hasAmount = true) : (this.hasAmount = false);
      value['amount']
        ? this.simulatorForm.patchValue({ amount: value['amount'] })
        : '';
    });
  }
  generateQr(value: boolean) {
    this.loading = true;
    this.isM2m = value;
    let simulateBody = this.simulatorForm.value;
    let reqBody: any = {
      merID: simulateBody.merID,
      msisdn: simulateBody.msisdn,
      amount: simulateBody.amount,
      walletAcqID: simulateBody.walletAcqID,
      isStatic: true,
      purpose: simulateBody.description,
      merchantName: simulateBody.merchantName,
      merchantCity: simulateBody.merchantCity,
      merchantScheme: simulateBody.merchantScheme,
      countryCode: simulateBody.countryCode,
      currencyCode: simulateBody.currencyCode,
      mcc: simulateBody.mcc,
    };

    this.globalServ.generateMerchantQr(reqBody).subscribe({
      next: (data: any) => {
        this.loading = false;
        this.qrValue = data.qrString;
        this.isM2m
          ? this.payMForm.patchValue({ qrString: this.qrValue })
          : this.payForm.patchValue({ qrString: this.qrValue });
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

  scanQr() {
    this.loading = true;
    this.globalServ.scanQr(this.qrValue).subscribe({
      next: (data: any) => {
        this.openPayForm = true;
        data.amount ? (this.hasAmount = true) : (this.hasAmount = false);
        this.payForm.patchValue({ amount: data.amount });
        this.payMForm.patchValue({ amount: data.amount });
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

  payQr() {
    this.loading = true;
    this.globalServ.payMerchantQr(this.payForm.value).subscribe({
      next: (data: any) => {
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
  payAsMerchant() {
    this.loading = true;
    this.globalServ.payAsMerchant(this.payMForm.value).subscribe({
      next: (data: any) => {
        if (data?.body?.responseCode === '00000') {
          this.message.success(data?.body?.responseDescription);
        } else if (data.responseCode == 400) {
          this.message.error(data?.message);
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
  get amount() {
    return this.payForm.controls['amount']?.value;
  }
}
