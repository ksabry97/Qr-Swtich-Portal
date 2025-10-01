import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-entity-header',
  imports: [CommonModule],
  templateUrl: './entity-header.html',
  styleUrl: './entity-header.scss',
})
export class EntityHeader {
  @Input() title = '';
  @Input() showButton = true;
  @Output() isCreateClicked = new EventEmitter();
}
