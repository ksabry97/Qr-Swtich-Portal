import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QrSpinner } from './shared/components/qr-spinner/qr-spinner';
import { CommonModule } from '@angular/common';
import { GlobalService } from './shared/services/global.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, QrSpinner, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  isLoading = signal(false);
  protected readonly title = signal('qr-swtich-portal');
  globalServ = inject(GlobalService);

  ngOnInit(): void {
    this.isLoading = this.globalServ.loading;
  }
}
