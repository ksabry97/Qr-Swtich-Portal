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
  pendingLogs: string[] = [];
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
        this.pendingLogs.push(newLog);
        this.processLogsSequentially();
      }
    });
  }

  async processLogsSequentially() {
    // Prevent overlapping animations
    if (this.isTyping) return;
    this.isTyping = true;

    while (this.pendingLogs.length > 0) {
      const nextLog = this.pendingLogs.shift()!;
      this.visibleLogs.push(''); // add new empty line
      await this.animateLog(nextLog);
    }

    this.isTyping = false;
  }

  async animateLog(text: string) {
    let visible = '';

    for (let i = 0; i < text.length; i++) {
      visible += text[i];
      this.visibleLogs[this.visibleLogs.length - 1] = visible;
      // trigger UI update
      this.visibleLogs = [...this.visibleLogs];
      await new Promise((r) => setTimeout(r, 30)); // typing speed
    }
  }
}
