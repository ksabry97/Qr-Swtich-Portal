import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  http = inject(HttpClient);
  baseUrl = environment.baseApiUrl;

  getAllTransactions(pageIndex: number, pageSize: number, filters: any = {}) {
    let reqBody = { pageIndex, pageSize, filters };
    let url = this.baseUrl + `/transactions`;

    return this.http.post(url, reqBody);
  }
  getTransaction(transactionId: string) {
    let url = this.baseUrl + `/transactions/${transactionId}`;
    return this.http.get(url);
  }
}
