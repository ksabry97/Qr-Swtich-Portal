import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QrInput } from '../../../../shared/components/qr-input/qr-input';
import { QrPassword } from '../../../../shared/components/qr-password/qr-password';
import { Router } from '@angular/router';
import { OtpModal } from '../otp-modal/otp-modal';
import { QrModal } from '../../../../shared/components/qr-modal/qr-modal';
import { GlobalService } from '../../../../shared/services/global.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, QrInput, QrPassword, QrModal],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup;
  otpModal = OtpModal;
  globalServ = inject(GlobalService);
  constructor(private readonly fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submitLogin() {
    if (this.loginForm.valid) {
      this.globalServ.setLoading(true);
      setTimeout(() => {
        this.globalServ.setLoading(false);
        this.globalServ.setModal(true);
      }, 2000);
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  forgetPassword() {
    this.router.navigateByUrl('/forget-password');
  }
}
