import { Component, inject, OnInit } from '@angular/core';
import { QrLogsService } from '../../services/qrSimulator.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qr-logs',
  imports: [CommonModule],
  templateUrl: './qr-logs.html',
  styleUrl: './qr-logs.scss',
})
export class QrLogs implements OnInit {
  logsServ = inject(QrLogsService);
  logs: any[] = [];
  visibleLogs: string[] = [];
  pendingLogs: string[] = [];
  isTyping = false;

  ngOnInit(): void {
    this.logsServ.startConnection();
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
