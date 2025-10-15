import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { LanguageSwitcher } from '../language-switcher/language-switcher';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-qr-header',
  imports: [
    NzDropDownModule,
    NzButtonModule,
    CommonModule,
    NzIconModule,
    LanguageSwitcher,
    TranslateModule,
  ],
  providers: [TranslateService],
  templateUrl: './qr-header.html',
  styleUrl: './qr-header.scss',
})
export class QrHeader {
  router = inject(Router);
  logOut() {
    this.router.navigateByUrl('/login');
    localStorage.clear();
  }
}
