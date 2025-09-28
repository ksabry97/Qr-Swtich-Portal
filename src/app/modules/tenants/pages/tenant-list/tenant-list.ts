import { Component } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';

@Component({
  selector: 'app-tenant-list',
  imports: [EntityHeader],
  templateUrl: './tenant-list.html',
  styleUrl: './tenant-list.scss',
})
export class TenantList {}
