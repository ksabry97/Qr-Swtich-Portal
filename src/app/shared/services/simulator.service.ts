import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as signalR from '@microsoft/signalr';
@Injectable({ providedIn: 'root' })
export class LogsService {
  private hubConnection!: signalR.HubConnection;
  logEvents = new BehaviorSubject<any[]>([]);

  logs$ = this.logEvents.asObservable();

  startConnection(walletId: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://gimuat.gimpay.org:6033/loggingHub')
      .build();

    this.hubConnection.start();

    this.hubConnection.on(walletId, (log) => {
      const current = this.logEvents.value;
      this.logEvents.next([...current, log]);
    });
  }
}
