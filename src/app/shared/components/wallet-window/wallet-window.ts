import { Component, inject, OnInit } from '@angular/core';
import { LogsService } from '../../services/simulator.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-wallet-window',
  imports: [CommonModule],
  templateUrl: './wallet-window.html',
  styleUrl: './wallet-window.scss',
})
export class WalletWindow implements OnInit {
  logsServ = inject(LogsService);
  activeRoute = inject(ActivatedRoute);
  logs: any[] = [];
  visibleLogs: string[] = [];
  isTyping = false;
  walletName = '';
  walletId = '';
  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe((value) => {
      this.walletName = value['name'];
      this.walletId = value['id'];
      this.logsServ.startConnection(this.walletId);
    });
    this.logsServ.logs$.subscribe(async (value) => {
      if (value.length > this.logs.length) {
        const newLog = value[value.length - 1];
        this.logs = value;
        this.visibleLogs.push('');
        await this.animateLog(newLog);
      }
    });

    // Simulate new logs every second (for demo)
    // setInterval(() => {
    //   const current = this.logsServ.logEvents.value;
    //   this.logsServ.logEvents.next([...current, 'New backend log message...']);
    // }, 2000);
  }

  async animateLog(text: string) {
    this.isTyping = true;
    let visible = '';

    // type each character gradually
    for (let i = 0; i < text.length; i++) {
      visible += text[i];
      this.visibleLogs[this.visibleLogs.length - 1] = visible;
      await new Promise((r) => setTimeout(r, 30)); // typing speed
    }

    this.isTyping = false;
  }
}
