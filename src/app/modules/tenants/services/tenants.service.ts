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

  getAllTenants(pageNumber: number, pageSize: number, filters: any = {}) {
    let url = this.baseUrl + '/api/Tenant/list';
    let reqBody = {
      pageNumber,
      pageSize,
      filters,
    };
    return this.http.post(url, reqBody);
  }

  approveTenant(tenantId: string) {
    let url = this.baseUrl + `/api/Tenant/${tenantId}/approve`;
    return this.http.post(url, '');
  }
  getTenantById(tenantId: string) {
    let url = this.baseUrl + `/api/Tenant/${tenantId}`;
    return this.http.get(url);
  }

  activateTenant(tenantId: string) {
    let url = this.baseUrl + `/api/Tenant/${tenantId}/activate`;
    return this.http.post(url, '');
  }
  deactivateTenant(tenantId: string) {
    let url = this.baseUrl + `/api/Tenant/${tenantId}/deactivate`;
    return this.http.post(url, '');
  }
}
