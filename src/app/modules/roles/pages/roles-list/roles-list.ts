import { Component, effect, inject, OnInit } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';
import {
  QrTable,
  TableAction,
  TableColumn,
} from '../../../../shared/components/qr-table/qr-table';
import { AddRole } from '../add-role/add-role';
import { GlobalService } from '../../../../shared/services/global.service';
import { QrModal } from '../../../../shared/components/qr-modal/qr-modal';
import { TranslateModule } from '@ngx-translate/core';
import { RolesService } from '../../services/roles.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-roles-list',
  imports: [EntityHeader, QrTable, QrModal, TranslateModule],
  templateUrl: './roles-list.html',
  styleUrl: './roles-list.scss',
})
export class RolesList implements OnInit {
  addRole = AddRole;
  globalServ = inject(GlobalService);
  roleServ = inject(RolesService);
  viewMode = false;
  roleId = '';
  editMode = false;
  columns: TableColumn[] = [
    { field: 'name', header: 'roles.table.roleName', sortable: false },
    {
      field: 'description',
      header: 'roles.table.description',
      sortable: false,
    },
  ];

  actions: TableAction[] = [
    {
      label: 'roles.actions.viewDetails',
      icon: 'eye',
      severity: 'info',
    },
    {
      label: 'roles.actions.edit',
      icon: 'edit',
      severity: 'warn',
    },
  ];

  roles = [];
  Roles: any;
  constructor(private readonly message: NzMessageService) {
    effect(() => {
      this.globalServ.isSubmitted() ? this.getAllRoles() : '';
    });
  }
  ngOnInit(): void {
    this.getAllRoles();
    this.globalServ.PermissionsPerModule.subscribe((value) => {
      this.Roles = value.Roles?.permissions;
      this.actions = [
        {
          label: 'users.actions.viewDetails',
          icon: 'eye',
          severity: 'info',
          disabled: !this.isAllowed(this.Roles.ViewRole),
        },
        {
          label: 'users.actions.edit',
          icon: 'edit',
          severity: 'warn',
          disabled: !this.isAllowed(this.Roles.EditRole),
        },
      ];
    });
  }
  openModel() {
    this.viewMode = false;
    this.editMode = false;
    this.globalServ.setModal(true);
  }

  getAllRoles() {
    this.globalServ.setLoading(true);
    this.globalServ.getAllRoles().subscribe({
      next: (data: any) => {
        this.roles = data.data;
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
        this.roleId = action.rowData.id;
        return;
      case 'warn':
        this.globalServ.setModal(true);
        this.editMode = true;
        this.roleId = action.rowData.id;
    }
  }
  isAllowed(permission: string) {
    return this.globalServ.usersPermission.value.includes(permission);
  }
}
