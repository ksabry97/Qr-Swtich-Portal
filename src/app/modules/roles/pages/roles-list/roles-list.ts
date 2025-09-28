import { Component } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';

@Component({
  selector: 'app-roles-list',
  imports: [EntityHeader],
  templateUrl: './roles-list.html',
  styleUrl: './roles-list.scss',
})
export class RolesList {}
