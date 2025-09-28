import { Component } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';

@Component({
  selector: 'app-fees-list',
  imports: [EntityHeader],
  templateUrl: './fees-list.html',
  styleUrl: './fees-list.scss',
})
export class FeesList {}
