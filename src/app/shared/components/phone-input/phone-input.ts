import { Component, forwardRef, Input, OnInit } from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  ControlValueAccessor,
  FormGroup,
  FormControl,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  parsePhoneNumberFromString,
  getCountries,
  getCountryCallingCode,
  AsYouType,
  CountryCode,
} from 'libphonenumber-js';
import { ErrorMessages } from '../../services/error-messages.service';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-phone-input',
  imports: [CommonModule, FormsModule, NzInputModule, NzIconModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInput),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PhoneInput),
      multi: true,
    },
  ],
  templateUrl: './phone-input.html',
  styleUrl: './phone-input.scss',
})
export class PhoneInput implements ControlValueAccessor, Validator, OnInit {
  @Input() label = 'Phone number';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() pattern?: string;
  @Input() showClear: boolean = false;
  @Input() showIcon: boolean = false;
  @Input() icon: string = '';
  @Input() suffix: string = '';
  @Input() prefix: string = '';
  @Input() parentGroup!: FormGroup;
  @Input() controlName!: string;
  public value: string = '';
  countries: { name: string; code: string; dial: string; flag: string }[] = [];
  selectedCountryCode: CountryCode = 'SN';

  onChange = (value: any) => {};
  onTouched = () => {};
  public isDisabled: boolean = false;
  constructor(private readonly errorMessagesServ: ErrorMessages) {}
  get control() {
    return this.parentGroup?.get(this.controlName) as FormControl;
  }
  ngOnInit(): void {
    this.loadCountries();
  }

  private loadCountries() {
    const all = getCountries();
    this.countries = all.map((code: CountryCode) => ({
      code: code as string,
      dial: `+${getCountryCallingCode(code)}`,
      flag: `https://flagcdn.com/24x18/${code.toLowerCase()}.png`,
      name: new Intl.DisplayNames(['en'], { type: 'region' }).of(code) || code,
    }));
  }

  writeValue(value: any): void {
    if (value) {
      // Try to detect and parse the number
      const parsed = parsePhoneNumberFromString(value);
      if (parsed && parsed.country) {
        this.selectedCountryCode = parsed.country as CountryCode;
        this.value =
          parsed.nationalNumber ||
          parsed.number?.replace(parsed.countryCallingCode, '').trim() ||
          '';
      } else {
        // If value already has country code, try to extract it
        const fullNumber = value.toString().trim();
        if (fullNumber.startsWith('+')) {
          const parsedFull = parsePhoneNumberFromString(fullNumber);
          if (parsedFull && parsedFull.country) {
            this.selectedCountryCode = parsedFull.country as CountryCode;
            this.value = parsedFull.nationalNumber;
          } else {
            this.value = fullNumber.replace(/^\+\d+\s*/, '');
          }
        } else {
          this.value = fullNumber;
        }
      }
    } else {
      this.value = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onPhoneInput(value: string) {
    const formatted = new AsYouType(this.selectedCountryCode).input(value);
    this.value = formatted;
    const fullNumber = `${this.getSelectedDialCode()}${this.value}`.trim();
    this.onChange(fullNumber);
    // Trigger validation
    if (this.control) {
      this.control.updateValueAndValidity();
    }
  }

  onCountryCodeChange(code: string) {
    this.selectedCountryCode = code as CountryCode;
    const fullNumber = `${this.getSelectedDialCode()}${this.value}`.trim();
    this.onChange(fullNumber);
    if (this.control) {
      this.control.updateValueAndValidity();
    }
  }

  onCountryChange() {
    const fullNumber = `${this.getSelectedDialCode()}${this.value}`.trim();
    this.onChange(fullNumber);
    if (this.control) {
      this.control.updateValueAndValidity();
    }
  }

  getSelectedDialCode(): string {
    return `+${getCountryCallingCode(this.selectedCountryCode)}`;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control?.value;

    if (this.required && (!value || !value.toString().trim())) {
      return { required: true };
    }

    if (!value || !value.toString().trim()) {
      return null; // Empty is valid if not required
    }

    // Try to parse the full number with country code
    const fullNumber = value.toString().trim();
    let phoneNumber = parsePhoneNumberFromString(
      fullNumber,
      this.selectedCountryCode
    );

    // If parsing with country code fails, try without specifying country
    if (!phoneNumber || !phoneNumber.isValid()) {
      phoneNumber = parsePhoneNumberFromString(fullNumber);
    }

    if (!phoneNumber || !phoneNumber.isValid()) {
      return { invalidPhone: true };
    }

    return null;
  }

  get errorMessage() {
    const control = this.control;
    if (control && control.invalid && control.touched) {
      if (control.errors?.['invalidPhone']) {
        return 'Please enter a valid phone number';
      }
      return this.errorMessagesServ.getErrorMessages(
        this.parentGroup,
        this.controlName,
        this.label
      );
    }
    return '';
  }
}
