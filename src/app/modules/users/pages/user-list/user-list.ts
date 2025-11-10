import { Component, effect, inject, OnInit } from '@angular/core';
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
import { TranslateModule } from '@ngx-translate/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../../../shared/services/auth.service';

@Component({
  selector: 'app-user-list',
  imports: [EntityHeader, QrTable, QrModal, TranslateModule],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss',
})
export class UserList implements OnInit {
  globalServ = inject(GlobalService);
  userServ = inject(UserService);
  authServ = inject(AuthService);
  addUser = AddUser;
  viewMode = false;
  editMode = false;
  userId = '';
  columns: TableColumn[] = [
    {
      field: 'firstName',
      header: 'users.table.name',
      width: '100px',
      sortable: false,
    },
    { field: 'username', header: 'users.table.username', sortable: false },
    {
      field: 'email',
      header: 'users.table.email',
      sortable: false,
    },
    {
      field: 'enabled',
      header: 'tenants.table.status',
      sortable: false,
      template: 'boolean',
    },
  ];
  Users: any;
  actions: TableAction[] = [];

  users = [];
  total = 0;
  pageIndex = 1;
  pageSize = 10;
  openModel() {
    this.viewMode = false;
    this.editMode = false;
    this.globalServ.setModal(true);
  }
  constructor(private readonly message: NzMessageService) {
    effect(() => {
      this.globalServ.isSubmitted()
        ? this.getAllUsers(this.pageIndex, this.pageSize)
        : '';
    });
  }
  ngOnInit(): void {
    this.getAllUsers(this.pageIndex, this.pageSize);
    this.globalServ.PermissionsPerModule.subscribe((value) => {
      this.Users = value.Users?.permissions;
      this.actions = [
        {
          label: 'users.actions.viewDetails',
          icon: 'eye',
          severity: 'info',
          disabled: !this.isAllowed(this.Users?.ViewUser),
        },
        {
          label: 'users.actions.edit',
          icon: 'edit',
          severity: 'warn',
          disabled: !this.isAllowed(this.Users?.EditUser),
        },

        {
          label: 'users.actions.deactivate',
          icon: 'lock',
          severity: 'danger',
          disabled: !this.isAllowed(this.Users?.DeactivateUser),
        },
      ];
    });
  }
  getAllUsers(pageIndex: number, pageSize: number) {
    this.globalServ.setLoading(true);
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.globalServ.isSubmitted.set(false);
    this.userServ.getAllUsers(pageIndex, pageSize).subscribe({
      next: (data: any) => {
        this.users = data.data;
        this.total = data?.pagination?.size;
      },
      error: () => {
        this.globalServ.setLoading(false);
      },
      complete: () => {
        this.globalServ.setLoading(false);
      },
    });
  }

  callAction(action: any) {
    this.viewMode = false;
    this.editMode = false;
    switch (action.action.severity) {
      case 'info':
        this.globalServ.setModal(true);
        this.viewMode = true;
        this.userId = action.rowData.id;
        return;
      case 'warn':
        this.globalServ.setModal(true);
        this.editMode = true;
        this.userId = action.rowData.id;
    }
  }

  activateUser(event: any) {
    this.userServ.activateUser(event.id).subscribe({
      next: (data: any) => {
        this.message.success(data.Message);
        this.getAllUsers(this.pageIndex, this.pageSize);
      },
      error: (err) => {
        this.message.error(err.error.Message);
      },
    });
  }

  isAllowed(permission: string) {
    return this.authServ.hasPermission(permission);
  }
}
