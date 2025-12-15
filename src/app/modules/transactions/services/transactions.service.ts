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
    let url =
      this.baseUrl +
      `/transactions?PageNumber=${pageIndex}&PageSize=${pageSize}`;
    Object.keys(filters).forEach((key) => {
      const value = filters[key];
      if (value !== null && value !== undefined && value !== '') {
        url += `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
    });
    return this.http.get(url);
  }
  getTransaction(transactionId: string) {
    let url = this.baseUrl + `/transactions/${transactionId}`;
    return this.http.get(url);
  }
}
