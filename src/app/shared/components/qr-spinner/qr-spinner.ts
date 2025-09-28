import { Component, Input } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-qr-spinner',
  imports: [NzSpinModule],
  templateUrl: './qr-spinner.html',
  styleUrl: './qr-spinner.scss',
})
export class QrSpinner {
  @Input() size: 'large' | 'small' | 'default' = 'default';
}
