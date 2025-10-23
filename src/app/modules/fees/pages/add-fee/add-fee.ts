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
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { ModalHeader } from '../../../../shared/components/modal-header/modal-header';
import { QrInput } from '../../../../shared/components/qr-input/qr-input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { QrInputNumber } from '../../../../shared/components/qr-input-number/qr-input-number';
import { FeesService } from '../../services/fees.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { QrSelect } from '../../../../shared/components/qr-select/qr-select';
import { GlobalService } from '../../../../shared/services/global.service';
import { TranslateModule } from '@ngx-translate/core';
import { integerValidator } from '../../services/integer-validator';
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
    TranslateModule,
  ],
  templateUrl: './add-fee.html',
  styleUrl: './add-fee.scss',
})
export class AddFee implements OnInit, OnChanges {
  feeForm!: FormGroup;
  globalServ = inject(GlobalService);
  currencies = [];
  @Input() viewMode = false;
  @Input() feeId = '';
  constructor(
    private fb: FormBuilder,
    private readonly feeServ: FeesService,
    private message: NzMessageService
  ) {
    this.feeForm = this.fb.group({
      name: ['', Validators.required],
      currency: ['', Validators.required],
      feeType: [0],
      flatFee: [
        null,
        [Validators.required, Validators.min(0), integerValidator()],
      ],
      percentage: [null, [Validators.max(100)]],
    });
  }

  ngOnInit(): void {
    this.getAllCurrencies();
  }
  submit() {
    if (this.feeForm.valid) {
      this.globalServ.requestLoading.set(true);
      this.feeServ.createFee(this.feeForm.value).subscribe({
        next: (data: any) => {
          this.globalServ.setModal(false);
          this.globalServ.isSubmitted.set(true);
          this.globalServ.requestLoading.set(false);
          this.message.success(data?.Message);
        },
        error: (err) => {
          this.globalServ.requestLoading.set(false);
          this.message.error(err?.error?.Message);
        },
      });
    } else {
      this.feeForm.markAllAsTouched();
    }
  }

  getAllCurrencies() {
    this.globalServ.getAllCurrencies().subscribe({
      next: (data: any) => {
        const mappedData = data.data.map((item: any) => ({
          text: item.text,
          value: item.text,
        }));
        this.currencies = mappedData;
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viewMode']) {
      if (this.viewMode) {
        this.feeServ.getFeeProfileById(this.feeId).subscribe({
          next: (data: any) => {
            this.feeForm.patchValue(data.data);
          },
        });
      }
    }
  }

  addValidator(controlName: string, removedControl: string) {
    this.feeForm.get(controlName)?.addValidators([Validators.required]);
    this.feeForm.get(removedControl)?.removeValidators([Validators.required]);
    this.feeForm.get(controlName)?.updateValueAndValidity();
    this.feeForm.get(removedControl)?.updateValueAndValidity();
  }
}
