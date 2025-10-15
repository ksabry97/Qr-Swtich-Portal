import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-entity-header',
  imports: [CommonModule, TranslateModule],
  templateUrl: './entity-header.html',
  styleUrl: './entity-header.scss',
})
export class EntityHeader {
  @Input() title = '';
  @Input() showButton = true;
  @Output() isCreateClicked = new EventEmitter();
}
