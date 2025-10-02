import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { ModalHeader } from '../../../../shared/components/modal-header/modal-header';
import { QrInput } from '../../../../shared/components/qr-input/qr-input';
import { QrSelect } from '../../../../shared/components/qr-select/qr-select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

@Component({
  selector: 'app-add-merchant',
  imports: [
    CommonModule,
    ModalHeader,
    ModalFooter,
    ReactiveFormsModule,
    QrInput,
    QrSelect,
    NzSwitchModule,
  ],
  templateUrl: './add-merchant.html',
  styleUrl: './add-merchant.scss',
})
export class AddMerchant {
  merchantForm!: FormGroup;
  types = [
    {
      text: 'Development',
      value: '1',
    },
    {
      text: 'Staging',
      value: '2',
    },
    {
      text: 'Production',
      value: '3',
    },
  ];

  constructor(private fb: FormBuilder) {
    this.merchantForm = this.fb.group({
      merchantName: ['', Validators.required],
      categoryId: ['', Validators.required],
      countryId: ['', Validators.required],
      address: ['', Validators.required],
      contactPhone: [''],
      contactEmail: [''],
      taxId: [''],
      terminalId: [''],
      businessType: [''],
      feeProfile: [''],
      host: [''],
      static: [false],
      dynamic: [false],
      rp: [false],
    });
  }
  submit() {
    console.log(this.merchantForm.value);
  }
}
