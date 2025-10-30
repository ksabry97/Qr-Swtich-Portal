import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-un-authorized',
  imports: [CommonModule, NzIconModule, TranslateModule],
  templateUrl: './un-authorized.html',
  styleUrl: './un-authorized.scss',
})
export class UnAuthorized {
  constructor(private readonly router: Router) {}

  back() {
    this.router.navigateByUrl('/dashboard');
  }
}
