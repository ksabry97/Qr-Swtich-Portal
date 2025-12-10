import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, inject, OnChanges, OnDestroy, signal, SimpleChanges } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { Subject, takeUntil } from 'rxjs';
import { ErrorMessages } from '../../services/error-messages.service';
export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'custom';
  value?: any;
  message: string;
  customValidator?: (value: any) => boolean;
}
@Component({
  selector: 'app-qr-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzInputModule,
    NzIconModule,
    FormsModule,
    TranslateModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QrPassword),
      multi: true,
    },
  ],
  templateUrl: './qr-password.html',
  styleUrl: './qr-password.scss',
})
export class QrPassword implements OnChanges, OnDestroy {
  passwordVisible = false;
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
  @Input() parentGroup!: FormGroup;
  @Input() controlName!: string;
  public value: any = null;
  public changed = (value: string) => {};
  public touched = () => {};
  public isDisabled: boolean = false;
  private translate = inject(TranslateService);
  private destroy$ = new Subject<void>();
  translatedPlaceholder = signal<string>('');
  
  constructor(private readonly errorMessagesServ: ErrorMessages) {
    this.updatePlaceholder();
    this.translate.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updatePlaceholder();
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['placeholder']) {
      this.updatePlaceholder();
    }
  }
  
  private updatePlaceholder(): void {
    if (!this.placeholder) {
      this.translatedPlaceholder.set('');
      return;
    }
    this.translatedPlaceholder.set(this.translate.instant(this.placeholder));
  }
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
    this.isDisabled = isDisabled;
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
