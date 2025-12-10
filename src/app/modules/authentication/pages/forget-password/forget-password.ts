import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { QrInput } from '../../../../shared/components/qr-input/qr-input';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoginServ } from '../../services/login-serv.service';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-forget-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QrInput,
    TranslateModule,
    NzIconModule,
  ],
  templateUrl: './forget-password.html',
  styleUrl: './forget-password.scss',
})
export class ForgetPassword {
  resetForm!: FormGroup;
  messageServ = inject(NzMessageService);
  loginServ = inject(LoginServ);
  loading = false;
  constructor(private fb: FormBuilder, private router: Router) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required]],
    });
  }

  back() {
    this.router.navigateByUrl('/login');
  }
  forgetPassword() {
    if (this.resetForm.valid) {
      this.loading = true;
      this.loginServ.forgetPassword(this.resetForm.value).subscribe({
        next: (data: any) => {
          this.messageServ.success(data?.Message);
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.messageServ.error(err?.error.Message);
        },
      });
    } else {
      this.resetForm.markAllAsTouched();
    }
  }
}
