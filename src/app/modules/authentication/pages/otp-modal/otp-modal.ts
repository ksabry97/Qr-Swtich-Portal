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

import { jwtDecode } from 'jwt-decode';
import { ResourcesObject } from '../../../roles/interfaces/role';
interface JwtPayload {
  sub: string;
  name?: string;
  email?: string;
  realm_access?: { roles?: string[] }; // adjust key based on your token structure
  [key: string]: any;
  preferred_username: string;
}
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
    } catch (err: any) {
      console.log('Login error:', err.error);
      this.errorMessage = 'wrong OTP';
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
  async onSubmit(event?: Event | any) {
    event?.preventDefault();
    event?.stopPropagation();

    // Ensure OTP is not empty and not already loading
    if (!this.otp || this.otp.length !== 4 || this.loading) {
      return;
    }

    await this.login();
  }
  getAllPermissions() {
    this.globalServ.getAllPermissions().subscribe({
      next: (data: any) => {
        let permissions = Object.fromEntries(
          data.data.map(
            ({
              resource,
              permissions,
            }: {
              resource: string;
              permissions: { name: string; code: any }[];
            }) => [
              resource,
              {
                permissions: Object.fromEntries(
                  permissions.map((p) => [p.name, p.code])
                ),
              },
            ]
          )
        ) as Partial<ResourcesObject>;

        this.globalServ.PermissionsPerModule.next(permissions);
        const token = localStorage.getItem('token') || '';

        const decoded = jwtDecode<JwtPayload>(token);

        let roles = decoded.realm_access?.roles || decoded['role'] || [];

        roles = Array.isArray(roles) ? roles : [roles];
        this.globalServ.usersPermission.next(roles);
      },
    });
  }
}
