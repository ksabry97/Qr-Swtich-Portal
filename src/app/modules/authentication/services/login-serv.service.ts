import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { encryptBackendRequest } from '../../../utils/aes-decryptor';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginServ {
  http = inject(HttpClient);
  baseUrl = environment.baseApiUrl;
  preLogin(cipherText: string) {
    let reqBody = { cipherText };
    let url = this.baseUrl + '/identity/PreLoginEndpointEncyrption';
    return this.http.post(url, reqBody, { responseType: 'text' });
  }
  async sendOtp(otp: string): Promise<string> {
    const sessionToken = localStorage.getItem('sessiontoken');
    const reqBody = { sessionToken, otp };
    const url = this.baseUrl + '/identity/VerifyOtpEndpointEncyrption';

    const cipherText = await encryptBackendRequest(
      reqBody,
      environment.publicEncryptionKey
    );

    return await firstValueFrom(
      this.http.post(url, { cipherText }, { responseType: 'text' })
    );
  }

  forgetPassword(formValue: { email: string }) {
    let url = this.baseUrl + '/identity/forgot-password';
    let reqBody = { usernameOrEmail: formValue.email };
    return this.http.post(url, reqBody);
  }
  changePassword(formValue: any) {
    let url = this.baseUrl + '/identity/change-password';
    let reqBody = formValue;
    return this.http.post(url, reqBody);
  }
}
