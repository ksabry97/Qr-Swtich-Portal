import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-qr-modal',
  imports: [CommonModule, NzModalModule],
  templateUrl: './qr-modal.html',
  styleUrl: './qr-modal.scss',
})
export class QrModal {
  @Input() isVisible: boolean = false;
  @Input() modalComponent!: any;
}
