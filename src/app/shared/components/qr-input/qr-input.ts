import { Component, Input, forwardRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  ReactiveFormsModule,
  FormGroup,
  NG_VALUE_ACCESSOR,
  FormsModule,
} from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ErrorMessages } from '../../services/error-messages.service';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'custom';
  value?: any;
  message: string;
  customValidator?: (value: any) => boolean;
}

@Component({
  selector: 'app-qr-input',
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
      useExisting: forwardRef(() => QrInput),
      multi: true,
    },
  ],
  templateUrl: './qr-input.html',
  styleUrl: './qr-input.scss',
})
export class QrInput {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: 'text' | 'email' | 'password' = 'text';
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
  @Input() parentGroup!: FormGroup;
  @Input() controlName!: string;
  public value: any = null;
  public changed = (value: string) => {};
  public touched = () => {};
  public isDisabled: boolean = false;
  constructor(private readonly errorMessagesServ: ErrorMessages) {}
  get control() {
    return this.parentGroup.get(this.controlName) as FormControl;
  }
  public writeValue(value: string): void {
    this.value = value;
  }
  public onChange(event: Event | any): void {
    const value: any = (<HTMLInputElement>event.target).value;
    this.changed(value);
  }
  public registerOnChange(fn: any): void {
    this.changed = fn;
  }
  public registerOnTouched(fn: any): void {
    this.touched = fn;
  }
  public setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
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
  clearValue() {
    this.control.reset();
  }
}
