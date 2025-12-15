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
import { TableFilter } from '../../../../shared/components/table-filter/table-filter';
import { LookupData, LookupType } from '../../../../shared/core/interfaces';
import { FilterConfig } from '../../../../shared/components/dynamic-filter/dynamic-filter';

@Component({
  selector: 'app-user-list',
  imports: [EntityHeader, QrTable, QrModal, TranslateModule, TableFilter],
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
      field: 'isActive',
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
  filterConfigs: FilterConfig[] = [];
  lookups: LookupData = {
    [LookupType.Unknown]: [],
    [LookupType.Country]: [],
    [LookupType.City]: [],
    [LookupType.Currency]: [],
    [LookupType.MerchantCategoryCode]: [],
    [LookupType.Merchant]: [],
    [LookupType.MerchantType]: [],
    [LookupType.IdentificationType]: [],
    [LookupType.FeeProfile]: [],
    [LookupType.Wallet]: [],
    [LookupType.Tenant]: [],
    [LookupType.Role]: [],
    [LookupType.Permission]: [],
  };
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
  getAllUsers(pageIndex: number, pageSize: number, filters?: any) {
    this.globalServ.setLoading(true);
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.globalServ.isSubmitted.set(false);
    this.userServ.getAllUsers(pageIndex, pageSize, filters).subscribe({
      next: (data: any) => {
        this.users = data?.data?.users;
        this.total = data?.data?.totalCount;
        this.filterConfigs = data?.data?.stringProperties.map(
          (el: { name: string; type: string; lookUpEnum: LookupType }) => {
            return {
              key: el.name,
              type: el.type,
              label: el.name,
              options: this.lookups[el.lookUpEnum],
            };
          }
        );
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
  filterTable(event: any) {
    this.getAllUsers(this.pageIndex, this.pageSize, event);
  }
}
