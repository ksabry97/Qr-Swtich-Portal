import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Merchant } from '../interfaces/merchant';

@Injectable({
  providedIn: 'root',
})
export class MerchantService {
  http = inject(HttpClient);
  baseUrl = environment.baseApiUrl;

  createMerchant(merchant: Merchant) {
    let url = this.baseUrl + '/merchants/add';
    return this.http.post(url, merchant);
  }

  getAllMerchants(pageNumber: number, pageSize: number) {
    let url = this.baseUrl + '/merchants';
    let reqBody = {
      pageNumber,
      pageSize,
    };
    return this.http.post(url, reqBody);
  }

  getMerchantByMerchantId(Id: string) {
    let reqBody = { Id };
    let url = this.baseUrl + '/merchants/getByMerchantId';
    return this.http.post(url, reqBody);
  }

  updateMerchant(merchant: Merchant) {
    let url = this.baseUrl + '/merchants/update';
    return this.http.post(url, merchant);
  }
  getMerchantsLookups(searchQuery: string) {
    let reqBody = { searchQuery };
    let url = this.baseUrl + '/merchants/lookups';
    return this.http.post(url, reqBody);
  }
}
