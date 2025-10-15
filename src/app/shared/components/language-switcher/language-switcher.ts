import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-language-switcher',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NzSelectModule,
    NzIconModule,
  ],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.scss',
})
export class LanguageSwitcher {
  currentLang = 'en';

  constructor(private translate: TranslateService) {
    this.currentLang =
      this.translate.currentLang || this.translate.getDefaultLang() || 'en';
    localStorage.setItem('lang', this.currentLang);
  }
  switchLang(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
  }
}
