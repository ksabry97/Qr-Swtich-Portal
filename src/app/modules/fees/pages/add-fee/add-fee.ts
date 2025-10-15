import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { QrSelect } from '../../../../shared/components/qr-select/qr-select';
import { GlobalService } from '../../../../shared/services/global.service';
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
    QrSelect,
  ],
  templateUrl: './add-fee.html',
  styleUrl: './add-fee.scss',
})
export class AddFee implements OnInit {
  feeForm!: FormGroup;
  globalServ = inject(GlobalService);
  currencies = [];
  constructor(
    private fb: FormBuilder,
    private readonly feeServ: FeesService,
    private message: NzMessageService
  ) {
    this.feeForm = this.fb.group({
      name: ['', Validators.required],
      currency: ['', Validators.required],
      feeType: [0],
      flatFee: [null],
      percantage: [null],
    });
  }

  ngOnInit(): void {
    this.getAllCurrencies();
  }
  submit() {
    if (this.feeForm.valid) {
      this.feeServ.createFee(this.feeForm.value).subscribe({
        next: (data: any) => {
          this.message.success(data.Message);
          this.globalServ.setModal(false);
          this.globalServ.isSubmitted.set(true);
        },
        error: (err) => {
          this.message.error('endpoint failed');
        },
      });
    } else {
      this.feeForm.markAllAsTouched();
    }
    console.log(this.feeForm.value);
  }

  getAllCurrencies() {
    this.globalServ.getAllCurrencies().subscribe({
      next: (data: any) => {
        const mappedData = data.data.map((item: any) => ({
          text: item.name,
          value: String(item.id),
        }));
        this.currencies = mappedData;
      },
    });
  }
}
