import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommunicationLogsService {
  http = inject(HttpClient);
  baseUrl = environment.baseApiUrl;

  getAllCommLogs(pageIndex: number, pageSize: number) {
    let url =
      this.baseUrl +
      `/api/CommunicationLog?page=${pageIndex}&pageSize=${pageSize}`;
    return this.http.get(url);
  }
}
