import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QrSpinner } from './shared/components/qr-spinner/qr-spinner';
import { CommonModule } from '@angular/common';
import { GlobalService } from './shared/services/global.service';
import { TranslateService } from '@ngx-translate/core';

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
  constructor(private translate: TranslateService) {
    const saved = localStorage.getItem('lang') || 'en';
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');
    translate.use(saved);
  }

  ngOnInit(): void {
    this.isLoading = this.globalServ.loading;
  }
}
