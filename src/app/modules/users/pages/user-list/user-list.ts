import { Component } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';

@Component({
  selector: 'app-user-list',
  imports: [EntityHeader],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList {}
