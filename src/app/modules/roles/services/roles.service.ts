import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Role } from '../interfaces/role';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  http = inject(HttpClient);
  baseUrl = environment.baseApiUrl;

  createRole(role: Role) {
    let url = this.baseUrl + '/management/roles';
    return this.http.post(url, role);
  }

  getRoleById(id: string) {
    let url = this.baseUrl + `/management/roles/${id}`;
    return this.http.get(url);
  }

  updateRole(id: string, description: string, assignRoleById: any[]) {
    let url = this.baseUrl + `/management/roles/${id}`;
    let reqBody = { description, assignRoleById };
    return this.http.put(url, reqBody);
  }

  deleteRole(id: string) {
    let url = this.baseUrl + `/management/roles/${id}`;
    return this.http.delete(url);
  }
}
