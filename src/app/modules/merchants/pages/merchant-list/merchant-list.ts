import { Component } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';

@Component({
  selector: 'app-merchant-list',
  imports: [EntityHeader],
  templateUrl: './merchant-list.html',
  styleUrl: './merchant-list.scss',
})
export class MerchantList {}
