import { Component } from '@angular/core';
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
  ],
  templateUrl: './add-wallet.html',
  styleUrl: './add-wallet.scss',
})
export class AddWallet {
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

  constructor(private fb: FormBuilder) {
    this.walletForm = this.fb.group({
      walletName: ['', Validators.required],
      walletType: [''],
      environmentId: ['', Validators.required],
      description: [''],
      baseUrl: [''],
      port: ['443', Validators.required],
      maxConnections: ['', Validators.required],
      timeout: [''],
      useSSL: [false],
      apiKey: [''],
      userName: [''],
      password: [''],
      active: [false],
      notes: [''],
      enable: [false],
      checkIntervals: [],
    });
  }
  submit() {
    console.log(this.walletForm.value);
  }
}
