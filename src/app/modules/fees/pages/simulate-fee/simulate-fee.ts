import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { ModalHeader } from '../../../../shared/components/modal-header/modal-header';
import { QrInputNumber } from '../../../../shared/components/qr-input-number/qr-input-number';

import { QrSelect } from '../../../../shared/components/qr-select/qr-select';
import { GlobalService } from '../../../../shared/services/global.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FeesService } from '../../services/fees.service';

@Component({
  selector: 'app-simulate-fee',
  imports: [
    CommonModule,
    ModalHeader,
    ModalFooter,
    ReactiveFormsModule,

    NzIconModule,
    QrInputNumber,
    QrSelect,
    TranslateModule,
  ],
  templateUrl: './simulate-fee.html',
  styleUrl: './simulate-fee.scss',
})
export class SimulateFee implements OnInit, OnChanges {
  feeForm!: FormGroup;
  globalServ = inject(GlobalService);
  feesProfiles = [];
  showDetails = false;
  details = [
    {
      label: 'fees.simulateFee.inputAmount',
      value: 0,
    },
    {
      label: 'fees.simulateFee.calculatedFee',
      value: 0,
    },
    {
      label: 'fees.simulateFee.totalAmount',
      value: 0,
    },
    {
      label: 'fees.simulateFee.detail',
      value: '',
    },
  ];
  @Input() feeId = '';

  constructor(
    private fb: FormBuilder,
    private readonly feeServ: FeesService,
    private message: NzMessageService
  ) {
    this.feeForm = this.fb.group({
      feeProfileId: ['', Validators.required],
      amount: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.globalServ.getAllfeesLookups().subscribe({
      next: (data: any) => {
        this.feesProfiles = data.data;
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['feeId']) {
      this.feeForm.patchValue({ feeProfileId: this.feeId });
    }
  }
  submit() {
    this.showDetails = false;
    if (this.feeForm.valid) {
      this.globalServ.requestLoading.set(true);
      this.feeServ.simulateFee(this.feeForm.value).subscribe({
        next: (data: any) => {
          this.details[0].value = data.data.inputAmount;
          this.details[1].value = data.data.calculatedFee;
          this.details[2].value = data.data.toatlAmount;
          this.details[3].value = data.data.detail;
          this.showDetails = true;
        },
        error: (err) => {
          this.globalServ.requestLoading.set(false);
          this.message.error(err?.error?.message);
        },
        complete: () => {
          this.globalServ.requestLoading.set(false);
        },
      });
    } else {
      this.feeForm.markAllAsTouched();
    }
  }
}
