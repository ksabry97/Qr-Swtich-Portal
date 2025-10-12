import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { ModalHeader } from '../../../../shared/components/modal-header/modal-header';
import { QrInput } from '../../../../shared/components/qr-input/qr-input';
import { QrDatePicker } from '../../../../shared/components/qr-date-picker/qr-date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { QrInputNumber } from '../../../../shared/components/qr-input-number/qr-input-number';
@Component({
  selector: 'app-add-fee',
  imports: [
    CommonModule,
    ModalHeader,
    ModalFooter,
    ReactiveFormsModule,
    QrInput,
    QrDatePicker,
    NzIconModule,
    QrInputNumber,
  ],
  templateUrl: './add-fee.html',
  styleUrl: './add-fee.scss',
})
export class AddFee {
  feeForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.feeForm = this.fb.group({
      feeName: ['', Validators.required],
      currency: ['', Validators.required],
      from: ['', Validators.required],
      to: [''],
      description: [''],
      feeType: [''],
      fixed: [null],
      percentage: [null],
      minValue: [null],
      maxValue: [null],
    });
  }
  submit() {
    console.log(this.feeForm.value);
  }
}
