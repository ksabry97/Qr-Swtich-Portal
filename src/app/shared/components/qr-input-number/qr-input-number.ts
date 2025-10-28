import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input } from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormsModule,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ErrorMessages } from '../../services/error-messages.service';
export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'custom';
  value?: any;
  message: string;
  customValidator?: (value: any) => boolean;
}
@Component({
  selector: 'app-qr-input-number',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    FormsModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QrInputNumber),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => QrInputNumber),
      multi: true,
    },
  ],
  templateUrl: './qr-input-number.html',
  styleUrl: './qr-input-number.scss',
})
export class QrInputNumber implements Validator {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() pattern?: string;
  @Input() validationRules: ValidationRule[] = [];
  @Input() showClear: boolean = false;
  @Input() showIcon: boolean = false;
  @Input() icon: string = '';
  @Input() suffix: string = '';
  @Input() prefix: string = '';
  @Input() parentGroup!: FormGroup;
  @Input() controlName!: string;
  @Input() filled = false;
  @Input() unit = '';
  @Input() min?: number;
  @Input() max?: number;
  @Input() minLength?: number;
  @Input() maxLength?: number;
  public value: any = null;
  public changed = (value: string) => {};
  public touched = () => {};
  public isDisabled: boolean = false;

  constructor(private readonly errorMessagesServ: ErrorMessages) {}
  get control() {
    return this.parentGroup?.get(this.controlName) as FormControl;
  }
  public writeValue(value: string): void {
    this.value = value;
  }
  public onChange(event: Event | any): void {
    const value: any = (<HTMLInputElement>event.target).value;
    this.value = value;
    this.changed(value);
    // Trigger validation
    if (this.control) {
      this.control.updateValueAndValidity();
    }
  }
  public registerOnChange(fn: any): void {
    this.changed = fn;
  }
  public registerOnTouched(fn: any): void {
    this.touched = fn;
  }
  public setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
  get errorMessage() {
    const control = this.control;
    if (control && control.invalid && control.touched) {
      return this.errorMessagesServ.getErrorMessages(
        this.parentGroup,
        this.controlName,
        this.label
      );
    }
    return '';
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control?.value;
    
    if (this.required && (value === null || value === undefined || value === '')) {
      return { required: true };
    }

    if (value === null || value === undefined || value === '') {
      return null; // Empty is valid if not required
    }

    // Convert to string for validation checks
    const stringValue = value.toString().trim();

    if (this.minLength !== undefined && stringValue.length < this.minLength) {
      return { minlength: { requiredLength: this.minLength, actualLength: stringValue.length } };
    }

    if (this.maxLength !== undefined && stringValue.length > this.maxLength) {
      return { maxlength: { requiredLength: this.maxLength, actualLength: stringValue.length } };
    }

    // Validate as number
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return { invalidNumber: true };
    }

    if (this.min !== undefined && numValue < this.min) {
      return { min: { min: this.min, actual: numValue } };
    }

    if (this.max !== undefined && numValue > this.max) {
      return { max: { max: this.max, actual: numValue } };
    }

    if (this.pattern) {
      const regex = new RegExp(this.pattern);
      if (!regex.test(stringValue)) {
        return { pattern: true };
      }
    }

    // Custom validation rules
    if (this.validationRules && this.validationRules.length > 0) {
      for (const rule of this.validationRules) {
        if (rule.type === 'required' && (!value || value.toString().trim() === '')) {
          return { required: true };
        }
        
        if (rule.type === 'custom' && rule.customValidator && !rule.customValidator(value)) {
          return { custom: { message: rule.message } };
        }
      }
    }

    return null;
  }

  clearValue() {
    if (this.control) {
      this.control.reset();
    }
  }
}
