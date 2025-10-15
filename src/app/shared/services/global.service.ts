import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  loading = signal<boolean>(false);
  isModalOpened = signal(false);
  isSubmitted = signal<boolean>(false);
  http = inject(HttpClient);
  baseUrl = environment.baseApiUrl;
  setLoading(val: boolean) {
    this.loading.set(val);
  }
  setModal(val: boolean) {
    this.isModalOpened.set(val);
  }

  getAllCountries() {
    let url = this.baseUrl + '/countries';
    return this.http.get(url);
  }
  getAllCurrencies() {
    let url = this.baseUrl + '/currencies';
    return this.http.get(url);
  }
  getMccs() {
    let url = this.baseUrl + '/Mccs';
    return this.http.get(url);
  }

  getCitiesByCountryId(id: number) {
    let url = this.baseUrl + '/cities/getByCountryId';
    let reqBody = { id };
    return this.http.post(url, reqBody);
  }

  getAllRoles() {
    let url = this.baseUrl + '/management/roles';
    return this.http.get(url);
  }
  getAllTenantLookups() {
    let url = this.baseUrl + '/api/Tenant/Lookups';
    return this.http.get(url);
  }
  getAllfeesLookups() {
    let url = this.baseUrl + '/fees/lookup';
    return this.http.get(url);
  }
  getAllPermissions() {
    let url = this.baseUrl + '/management/permessions';
    return this.http.get(url);
  }
}
