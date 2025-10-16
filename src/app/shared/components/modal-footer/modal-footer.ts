import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-modal-footer',
  imports: [NzIconModule, CommonModule],
  templateUrl: './modal-footer.html',
  styleUrl: './modal-footer.scss',
})
export class ModalFooter {
  globalServ = inject(GlobalService);
  @Input() submitText!: string;
  @Input() subText: string = '';
  @Input() disabled = false;
  @Output() isSubmitted = new EventEmitter();
  @Output() subSubmitted = new EventEmitter();

  submit() {
    this.isSubmitted.emit();
  }
  submitSub() {
    this.subSubmitted.emit();
  }
}
