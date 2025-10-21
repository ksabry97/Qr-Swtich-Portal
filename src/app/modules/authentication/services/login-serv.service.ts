import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { encryptBackendRequest } from '../../../utils/aes-decryptor';

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
  async sendOtp(otp: string) {
    let sessionToken = localStorage.getItem('sessiontoken');
    let reqBody = { sessionToken, otp };

    let url = this.baseUrl + '/identity/VerifyOtpEndpointEncyrption';

    let cipherText = await encryptBackendRequest(
      reqBody,
      environment.publicEncryptionKey
    );
    return this.http.post(
      url,
      {
        cipherText,
      },
      { responseType: 'text' }
    );
  }
}
