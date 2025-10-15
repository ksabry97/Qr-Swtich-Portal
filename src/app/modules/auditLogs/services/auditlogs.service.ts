import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuditsService {
  http = inject(HttpClient);
  baseUrl = environment.baseApiUrl;

  getAllAsudits(pageNumber: number, pageSize: number) {
    let url =
      this.baseUrl + `/api/audit-logs?page=${pageNumber}&pageSize=${pageSize}`;

    return this.http.get(url);
  }
}
