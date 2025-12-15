import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Wallet } from '../interfaces/wallet';
import { filter } from 'rxjs';

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

  getAllWallets(pageNumber: number, pageSize: number, filters: any = {}) {
    let url = this.baseUrl + '/wallets';
    let reqBody = { pageNumber, pageSize, filters };
    return this.http.post(url, reqBody);
  }

  getWalletById(id: string | number) {
    let reqBody = { id };
    let url = this.baseUrl + '/wallets/getById';
    return this.http.post(url, reqBody);
  }
}
