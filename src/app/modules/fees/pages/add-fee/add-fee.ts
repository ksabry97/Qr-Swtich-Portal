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
import { NzIconModule } from 'ng-zorro-antd/icon';
import { QrInputNumber } from '../../../../shared/components/qr-input-number/qr-input-number';
import { FeesService } from '../../services/fees.service';
import { NzMessageService } from 'ng-zorro-antd/message';
@Component({
  selector: 'app-add-fee',
  imports: [
    CommonModule,
    ModalHeader,
    ModalFooter,
    ReactiveFormsModule,
    QrInput,
    NzIconModule,
    QrInputNumber,
  ],
  templateUrl: './add-fee.html',
  styleUrl: './add-fee.scss',
})
export class AddFee {
  feeForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private readonly feeServ: FeesService,
    private message: NzMessageService
  ) {
    this.feeForm = this.fb.group({
      name: ['', Validators.required],
      currency: ['', Validators.required],
      feeType: [0],
      fixed: [null],
      percentage: [null],
    });
  }
  submit() {
    if (this.feeForm.valid) {
      this.feeServ.createFee(this.feeForm.value).subscribe({
        next: (data: any) => {},
        error: (err) => {
          this.message.error('endpoint failed');
        },
      });
    } else {
      this.feeForm.markAllAsTouched();
    }
    console.log(this.feeForm.value);
  }
}
