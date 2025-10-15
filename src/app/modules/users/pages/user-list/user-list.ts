import { Component, inject, OnInit } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  QrTable,
  TableAction,
  TableColumn,
} from '../../../../shared/components/qr-table/qr-table';
import { GlobalService } from '../../../../shared/services/global.service';
import { QrModal } from '../../../../shared/components/qr-modal/qr-modal';
import { AddUser } from '../add-user/add-user';
import { UserService } from '../../services/users.service';

@Component({
  selector: 'app-user-list',
  imports: [EntityHeader, QrTable, QrModal],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {
  globalServ = inject(GlobalService);
  userServ = inject(UserService);
  addUser = AddUser;
  columns: TableColumn[] = [
    { field: 'id', header: 'Name', width: '100px', sortable: false },
    { field: 'name', header: 'Email', sortable: false },
    {
      field: 'status',
      header: 'Roles',
      sortable: false,
    },
    { field: 'country', header: 'Status', sortable: false },
    { field: 'country', header: 'Created On', sortable: false },
  ];

  actions: TableAction[] = [
    {
      label: 'View Details',
      icon: 'eye',
      severity: 'info',
    },
    {
      label: 'Edit',
      icon: 'edit',
      severity: 'info',
    },
    {
      label: 'Reset Password',
      icon: 'key',
      severity: 'info',
    },
    {
      label: 'Deactivate',
      icon: 'pause',
      severity: 'info',
    },
    {
      label: 'Delete',
      icon: 'delete',
      severity: 'info',
    },
  ];

  users = [];
  openModel() {
    this.globalServ.setModal(true);
  }

  ngOnInit(): void {
    this.getAllUsers();
  }
  getAllUsers() {
    this.userServ.getAllUsers().subscribe({
      next: (data: any) => {
        this.users = data.data;
      },
      complete: () => {},
    });
  }
}
