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
}
