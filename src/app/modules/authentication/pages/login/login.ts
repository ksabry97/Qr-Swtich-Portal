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
import { LoginServ } from '../../services/login-serv.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitch } from '../../../../shared/components/labguage-switch/language-switcher';
import {
  decryptBackendResponse,
  encryptBackendRequest,
} from '../../../../utils/aes-decryptor';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    QrInput,
    QrPassword,
    QrModal,
    NzIconModule,
    TranslateModule,
    LanguageSwitch,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup;
  otpModal = OtpModal;
  globalServ = inject(GlobalService);
  loginServ = inject(LoginServ);
  errorMessage = '';
  loading = false;
  encryptionKey = environment.publicEncryptionKey;
  constructor(private readonly fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  submitLogin() {
    if (this.loginForm.valid) {
      this.globalServ.setLoading(true);
      this.errorMessage = '';
      this.loading = true;

      encryptBackendRequest(this.loginForm.value, this.encryptionKey).then(
        (value: string) => {
          this.loginServ.preLogin(value).subscribe((data: any) => {
            decryptBackendResponse(data, this.encryptionKey).then((value) => {
              if (value.Success) {
                localStorage.setItem('sessiontoken', value?.SessionToken);
                this.globalServ.setModal(true);
              } else {
                this.errorMessage = value?.ErrorMessage;
              }
              this.globalServ.setLoading(false);
              this.loading = false;
            });
          });
        }
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  forgetPassword() {
    this.router.navigateByUrl('/forget-password');
  }
}
