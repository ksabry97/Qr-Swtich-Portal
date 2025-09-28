import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OTPInput } from '../../../../shared/components/otp-input/otp-input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GlobalService } from '../../../../shared/services/global.service';
@Component({
  selector: 'app-otp-modal',
  imports: [OTPInput, NzIconModule],
  templateUrl: './otp-modal.html',
  styleUrl: './otp-modal.scss',
})
export class OtpModal implements OnInit, OnDestroy {
  resend = false;
  intervalId = 0;
  timer = 60;
  globalServ = inject(GlobalService);
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

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
