import { Component, inject } from '@angular/core';
import { QrSelect } from '../../../../shared/components/qr-select/qr-select';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { ModalHeader } from '../../../../shared/components/modal-header/modal-header';
import { QrInput } from '../../../../shared/components/qr-input/qr-input';
import { QrPassword } from '../../../../shared/components/qr-password/qr-password';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { QrInputNumber } from '../../../../shared/components/qr-input-number/qr-input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { WalletsService } from '../../services/wallets.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '../../../../shared/services/global.service';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-add-wallet',
  imports: [
    CommonModule,
    ModalHeader,
    ModalFooter,
    ReactiveFormsModule,
    QrInput,
    QrSelect,
    QrPassword,
    QrInputNumber,
    NzIconModule,
    NzSwitchModule,
    TranslateModule,
  ],
  templateUrl: './add-wallet.html',
  styleUrl: './add-wallet.scss',
})
export class AddWallet {
  walletServ = inject(WalletsService);
  globalServ = inject(GlobalService);
  walletForm!: FormGroup;
  isOpened = [false, false, false];
  types = [
    {
      text: 'Development',
      value: 0,
    },
    {
      text: 'Staging',
      value: 1,
    },
    {
      text: 'Production',
      value: 2,
    },
  ];
  walletTypes = [
    {
      text: 'Wallet',
      value: 0,
    },
    {
      text: 'Bank',
      value: 1,
    },
  ];

  constructor(private fb: FormBuilder, private message: NzMessageService) {
    this.walletForm = this.fb.group({
      name: ['', Validators.required],
      type: [''],
      environment: ['', Validators.required],
      description: [''],
      baseUrl: [''],
      port: ['443', Validators.required],
      macConnections: ['', Validators.required],
      connectionTimeout: [''],
      isHttps: [false],
      apiKey: [''],
      userName: [''],
      userPassword: [''],
      isActive: [false],
      notes: [''],
      enableHealthChecks: [false],
      healthChechInterval: [],
    });
  }
  submit() {
    this.globalServ.requestLoading.set(true);
    if (this.walletForm.valid) {
      this.walletServ.createWallet(this.walletForm.value).subscribe({
        next: (data: any) => {
          this.message.success(data.Message);
          this.globalServ.setModal(false);
          this.globalServ.isSubmitted.set(true);
          this.globalServ.requestLoading.set(false);
        },
        error: (err) => {
          this.message.error(err.error.Message);
          this.globalServ.requestLoading.set(false);
        },
      });
    } else {
      this.walletForm.markAllAsTouched();
    }
  }
}
