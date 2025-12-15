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

  getAllFees(pageNumber: number, pageSize: number, filters: any = {}) {
    let url = this.baseUrl + '/fees';
    let reqBody = {
      pageNumber,
      pageSize,
      filters,
    };
    return this.http.post(url, reqBody);
  }

  getFeeProfileById(feeProfileId: string) {
    let reqBody = { feeProfileId };
    let url = this.baseUrl + '/fees/getById';
    return this.http.post(url, reqBody);
  }
  simulateFee(feeProfile: any) {
    let url = this.baseUrl + '/fees/simulatefee';
    return this.http.post(url, feeProfile);
  }
}
