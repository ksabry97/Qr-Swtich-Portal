import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class QrLogsService {
  private hubConnection!: signalR.HubConnection;
  logEvents = new BehaviorSubject<any[]>([]);

  logs$ = this.logEvents.asObservable();

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.baseApiUrl}/loggingHub`, {
        withCredentials: false, // 👈 or remove the option entirely
      })
      .build();

    this.hubConnection.start();

    this.hubConnection.on('ReceiveLog', (log) => {
      console.log(log, 'wwwwwwwww');
      const current = this.logEvents.value;
      this.logEvents.next([...current, log]);
    });
  }
}
