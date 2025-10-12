import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Fee } from '../interfaces/fee';

@Injectable({
  providedIn: 'root',
})
export class FeesService {
  http = inject(HttpClient);
  baseUrl = environment.baseApiUrl;

  createFee(fee: Fee) {
    let url = this.baseUrl + '/fees/add';
    return this.http.post(url, fee);
  }
}
