import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';

import { QrPassword } from '../../../../shared/components/qr-password/qr-password';
import { PasswordValidators } from '../../services/custom-validator';
import { LoginServ } from '../../services/login-serv.service';

@Component({
  selector: 'app-change-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QrPassword,
    TranslateModule,
    FormsModule,
    NzIconModule,
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword {
  loading = false;
  resetForm!: FormGroup;
  translate = inject(TranslateService);
  validations = [
    {
      message: 'validation.min_length',
      valid: false,
      value: 'minLength',
    },
    { message: 'validation.uppercase', valid: false, value: 'uppercase' },
    { message: 'validation.lowercase', valid: false, value: 'lowercase' },
    { message: 'validation.number', valid: false, value: 'number' },
    { message: 'validation.special', valid: false, value: 'special' },
  ];

  loginServ = inject(LoginServ);
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private message: NzMessageService
  ) {
    this.resetForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: [
          '',
          [Validators.required, PasswordValidators.passwordStrength()],
        ],
        confirmPassword: ['', Validators.required],
        sessionToken: [''],
      },
      {
        validators: PasswordValidators.matchPassword(
          'newPassword',
          'confirmPassword'
        ),
      }
    );

    const sessionToken = localStorage.getItem('sessiontoken') ?? '';
    this.resetForm.patchValue({ sessionToken: sessionToken });
  }

  back() {
    this.router.navigateByUrl('login');
  }

  validate() {
    const passwordControl = this.resetForm.get('newPassword');
    const requirements = passwordControl?.errors?.['passwordRequirements'];

    // Safely handle the case where there are no errors
    const errors = requirements ? Object.keys(requirements) : [];
    this.validations = this.validations.map((rule: any) => {
      // If there are no errors, mark all as valid
      if (!errors.length) {
        return { ...rule, valid: true };
      }

      // If this rule's message appears in errors, mark invalid
      const isInvalid = errors.some(
        (err) => rule.value?.includes(err) || rule.message?.includes(err)
      );
      return { ...rule, valid: !isInvalid };
    });
  }

  submit() {
    if (this.resetForm.valid) {
      this.loading = true;
      this.loginServ.changePassword(this.resetForm.value).subscribe({
        next: (data: any) => {
          this.message.success(data.Message);
          localStorage.clear();
          this.router.navigateByUrl('/login');
        },
        error: (err) => {
          this.loading = false;
          this.message.error(err.error.Message);
        },
        complete: () => {
          this.loading = false;
        },
      });
    }
  }
}
