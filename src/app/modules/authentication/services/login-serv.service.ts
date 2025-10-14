import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginServ {
  http = inject(HttpClient);
  baseUrl = environment.baseApiUrl;
  preLogin(user: any) {
    let url = this.baseUrl + '/identity/pre-login';
    return this.http.post(url, user);
  }
  sendOtp(otp: string) {
    let sessionToken = localStorage.getItem('sessiontoken');
    let reqBody = { sessionToken, otp };
    let url = this.baseUrl + '/identity/verify-otp';
    return this.http.post(url, reqBody);
  }
}
