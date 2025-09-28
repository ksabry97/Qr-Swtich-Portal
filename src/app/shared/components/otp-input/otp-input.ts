import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  QueryList,
  ViewChildren,
} from '@angular/core';

@Component({
  selector: 'app-otp-input',
  imports: [CommonModule],
  templateUrl: './otp-input.html',
  styleUrl: './otp-input.scss',
})
export class OTPInput {
  @Input() length = 6;
  @ViewChildren('otpInput') inputs!: QueryList<ElementRef>;
  arr = new Array(this.length).fill(0);
  otpVal = '';
  otpOutput = new EventEmitter<string>();

  onOtpInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;

    let value = input.value.replace(/\D/g, '');

    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    input.value = value;

    if (value && index < this.inputs.length - 1) {
      this.inputs.toArray()[index + 1].nativeElement.focus();
    }

    if (
      !value &&
      index > 0 &&
      event instanceof InputEvent &&
      event.inputType === 'deleteContentBackward'
    ) {
      this.inputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  // paste the otp
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') ?? '';
    const numbers = pastedData.replace(/\D/g, '').split('');

    const inputsArray = this.inputs.toArray();
    numbers.forEach((num, i) => {
      if (i < inputsArray.length) {
        inputsArray[i].nativeElement.value = num;
      }
    });

    // focus last filled input
    const lastIndex = Math.min(numbers.length, inputsArray.length) - 1;
    if (lastIndex >= 0) {
      inputsArray[lastIndex].nativeElement.focus();
    }
  }

  // get the full otp value
  getValue() {
    this.otpVal = '';
    this.inputs.toArray().forEach((val) => {
      this.otpVal += val.nativeElement.value;
    });
    this.otpOutput.emit(this.otpVal);
  }
}
