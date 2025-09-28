import { Component } from '@angular/core';
import { OTPInput } from '../../../../shared/components/otp-input/otp-input';

@Component({
  selector: 'app-otp-modal',
  imports: [OTPInput],
  templateUrl: './otp-modal.html',
  styleUrl: './otp-modal.scss',
})
export class OtpModal {}
