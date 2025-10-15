import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QrInput } from '../../../../shared/components/qr-input/qr-input';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forget-password',
  imports: [CommonModule, ReactiveFormsModule, QrInput, TranslateModule],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.scss',
})
export class ForgetPassword {
  resetForm!: FormGroup;
  constructor(private fb: FormBuilder, private router: Router) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  back() {
    this.router.navigateByUrl('/login');
  }
}
