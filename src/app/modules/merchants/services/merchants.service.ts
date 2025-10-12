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
    let url = this.baseUrl + 'merchants/add';
    return this.http.post(url, merchant);
  }
}
