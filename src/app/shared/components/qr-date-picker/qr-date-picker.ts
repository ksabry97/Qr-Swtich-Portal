import { Component, forwardRef, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ErrorMessages } from '../../services/error-messages.service';
export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'custom';
  value?: any;
  message: string;
  customValidator?: (value: any) => boolean;
}

@Component({
  selector: 'app-qr-date-picker',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzIconModule,
  ],
  templateUrl: './qr-date-picker.html',
  styleUrl: './qr-date-picker.scss',
})
export class QrDatePicker {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() maxLength?: number;
  @Input() minLength?: number;
  @Input() pattern?: string;
  @Input() validationRules: ValidationRule[] = [];
  @Input() showClear: boolean = false;
  @Input() showIcon: boolean = false;
  @Input() icon: string = '';
  @Input() suffix: string = '';
  @Input() prefix: string = '';
  @Input() mode: 'date' | 'week' | 'month' | 'quarter' | 'year' = 'date';
  @Input() allowClear: boolean = false;
  @Input() showTime: boolean = false;
  @Input() dateFormat: string = '';
  @Input() parentGroup!: FormGroup;
  @Input() controlName!: string;

  constructor(private readonly errorMessagesServ: ErrorMessages) {}
  get control() {
    return this.parentGroup.get(this.controlName) as FormControl;
  }
  get errorMessage() {
    if (this.control.invalid && this.control.touched) {
      return this.errorMessagesServ.getErrorMessages(
        this.parentGroup,
        this.controlName,
        this.label
      );
    } else return '';
  }
}
