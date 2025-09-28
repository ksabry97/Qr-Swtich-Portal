import { Component } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
@Component({
  selector: 'app-wallet-list',
  imports: [EntityHeader],
  templateUrl: './wallet-list.html',
  styleUrl: './wallet-list.scss',
})
export class WalletList {}
