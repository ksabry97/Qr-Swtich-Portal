import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OTPInput } from '../../../../shared/components/otp-input/otp-input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GlobalService } from '../../../../shared/services/global.service';
import { LoginServ } from '../../services/login-serv.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-otp-modal',
  imports: [OTPInput, NzIconModule, CommonModule],
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

  login() {
    this.loading = true;
    this.errorMessage = '';
    this.loginServ.sendOtp(this.otp).subscribe({
      next: (data: any) => {
        localStorage.setItem('token', data.accessToken);
        this.router.navigateByUrl('/dashboard');
        this.globalServ.setModal(false);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error.errorMessage;
        this.loading = false;
      },
    });
  }
  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
