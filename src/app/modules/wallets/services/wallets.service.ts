import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Wallet } from '../interfaces/wallet';

@Injectable({
  providedIn: 'root',
})
export class WalletsService {
  http = inject(HttpClient);
  baseUrl = environment.baseApiUrl;

  createWallet(wallet: Wallet) {
    let url = this.baseUrl + '/wallets/add';
    return this.http.post(url, wallet);
  }

  getAllWallets(pageNumber: number, pageSize: number) {
    let url = this.baseUrl + '/wallets';
    let reqBody = { pageNumber, pageSize };
    return this.http.post(url, reqBody);
  }
}
