import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ExceptionLogsService {
  http = inject(HttpClient);
  baseUrl = environment.baseApiUrl;

  getAllExcepLogs(pageIndex: number, pageSize: number) {
    let url =
      this.baseUrl + `/api/ExceptionLog?page=${pageIndex}&pageSize=${pageSize}`;
    return this.http.get(url);
  }
}
