import { Component, Input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NG_VALUE_ACCESSOR,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { ErrorMessages } from '../../services/error-messages.service';

@Component({
  selector: 'app-qr-tags-input',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => QrTagsInput),
      multi: true,
    },
  ],
  templateUrl: './qr-tags-input.html',
  styleUrl: './qr-tags-input.scss',
})
export class QrTagsInput {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() allowDuplicates: boolean = false;
  @Input() maxTags?: number;
  @Input() mode?: string; // accept external [mode] binding for compatibility
  @Input() parentGroup!: FormGroup;
  @Input() controlName!: string;

  public tags: string[] = [];
  public inputValue: string = '';
  public isDisabled: boolean = false;

  public changed = (value: string[]) => {};
  public touched = () => {};

  constructor(private readonly errorMessagesServ: ErrorMessages) {}

  get control() {
    return this.parentGroup?.get(this.controlName) as FormControl;
  }

  public writeValue(value: string[] | null): void {
    this.tags = Array.isArray(value) ? [...value] : [];
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
    if (this.control?.invalid && this.control?.touched) {
      return this.errorMessagesServ.getErrorMessages(
        this.parentGroup,
        this.controlName,
        this.label
      );
    } else return '';
  }

  onInputChange(value: string) {
    this.inputValue = value;
  }

  onInputKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addFromInput();
    }
  }

  addFromInput() {
    if (this.readonly || this.disabled || this.isDisabled) return;
    const candidate = (this.inputValue || '').trim();
    if (!candidate) return;
    if (!this.allowDuplicates && this.tags.includes(candidate)) {
      this.inputValue = '';
      return;
    }
    if (this.maxTags !== undefined && this.tags.length >= this.maxTags) {
      return;
    }
    this.tags = [...this.tags, candidate];
    this.inputValue = '';
    this.emitValue();
  }

  removeTag(index: number) {
    if (this.readonly || this.disabled || this.isDisabled) return;
    this.tags = this.tags.filter((_, i) => i !== index);
    this.emitValue();
  }

  clearAll() {
    if (this.readonly || this.disabled || this.isDisabled) return;
    this.tags = [];
    this.inputValue = '';
    this.emitValue();
  }

  private emitValue() {
    this.changed([...this.tags]);
    // keep FormControl in sync if used within a parent form
    if (this.control) {
      this.control.setValue([...this.tags]);
      this.control.markAsDirty();
      this.control.updateValueAndValidity({ emitEvent: true });
    }
  }
}


