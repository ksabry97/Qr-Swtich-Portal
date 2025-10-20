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
import { QrInput } from '../../../../shared/components/qr-input/qr-input';
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
    QrInput,
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
  details = [
    {
      label: 'Input Amount',
      value: 0,
    },
    {
      label: 'Calculated Fee',
      value: 0,
    },
    {
      label: 'Total Amount',
      value: 0,
    },
    {
      label: 'Detail',
      value: 0,
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
    console.log('sasdw');
  }
}
