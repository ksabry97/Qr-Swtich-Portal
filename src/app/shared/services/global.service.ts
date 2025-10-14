import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  loading = signal<boolean>(false);
  isModalOpened = signal(false);
  http = inject(HttpClient);
  baseUrl = environment.baseApiUrl;
  setLoading(val: boolean) {
    this.loading.set(val);
  }
  setModal(val: boolean) {
    this.isModalOpened.set(val);
  }

  getAllCountries() {
    let url = environment.baseApiUrl + '/countries';
    return this.http.get(url);
  }
  getAllCurrencies() {
    let url = environment.baseApiUrl + '/currencies';
    return this.http.get(url);
  }
}
