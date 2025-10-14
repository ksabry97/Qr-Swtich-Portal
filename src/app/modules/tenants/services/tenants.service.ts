import { inject, Injectable } from '@angular/core';
import { Tenant } from '../interfaces/tenants';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TenantService {
  http = inject(HttpClient);
  baseUrl = environment.baseApiUrl;
  createTenant(tenant: Tenant) {
    let url = this.baseUrl + '/api/tenant';
    return this.http.post(url, tenant);
  }

  getAllTenants() {
    let url = this.baseUrl + '/api/Tenant';
    return this.http.get(url);
  }
}
