import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OTPInput } from '../../../../shared/components/otp-input/otp-input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GlobalService } from '../../../../shared/services/global.service';
import { LoginServ } from '../../services/login-serv.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { decryptBackendResponse } from '../../../../utils/aes-decryptor';
import { environment } from '../../../../../environments/environment';
import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-otp-modal',
  imports: [OTPInput, NzIconModule, CommonModule, TranslateModule],
  templateUrl: './otp-modal.html',
  styleUrl: './otp-modal.scss',
})
export class OtpModal implements OnInit, OnDestroy {
  resend = false;
  intervalId = 0;
  timer = 60;
  otp: string = '';
  globalServ = inject(GlobalService);
  loginServ = inject(LoginServ);
  router = inject(Router);
  loading = false;
  encryptionKey = environment.publicEncryptionKey;
  errorMessage = '';
  ngOnInit(): void {
    this.startTimer();
    this.clearInterval();
  }

  clearInterval() {
    setTimeout(() => {
      clearInterval(this.intervalId);
      this.resend = true;
    }, 60000);
  }

  startTimer() {
    this.timer = 60;
    this.resend = false;
    this.intervalId = setInterval(() => {
      this.timer -= 1;
    }, 1000);
    this.clearInterval();
  }
  formatTime(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  closeModal() {
    this.globalServ.setModal(false);
  }

  async login() {
    this.loading = true;
    this.errorMessage = '';

    try {
      const response = await this.loginServ.sendOtp(this.otp);
      const value = await decryptBackendResponse(response, this.encryptionKey);

      if (value.Success) {
        localStorage.setItem('token', value?.AccessToken);
        this.router.navigateByUrl('/dashboard');
        this.globalServ.setModal(false);
      } else {
        this.errorMessage = value?.ErrorMessage;
      }
    } catch (err) {
      console.error('Login error:', err);
      this.errorMessage = 'Something went wrong';
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
  onSubmit(event?: Event | any) {
    event?.preventDefault();
    this.login();
  }
}
