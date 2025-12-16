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
import { AuthService } from '../../../../shared/services/auth.service';
import { TableFilter } from '../../../../shared/components/table-filter/table-filter';
import { FilterConfig } from '../../../../shared/components/dynamic-filter/dynamic-filter';
import { LookupData, LookupType } from '../../../../shared/core/interfaces';

@Component({
  selector: 'app-roles-list',
  imports: [EntityHeader, QrTable, QrModal, TranslateModule, TableFilter],
  templateUrl: './roles-list.html',
  styleUrl: './roles-list.scss',
})
export class RolesList implements OnInit {
  addRole = AddRole;
  globalServ = inject(GlobalService);
  roleServ = inject(RolesService);
  authServ = inject(AuthService);
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
  lookups: LookupData = {
    [LookupType.Unknown]: [],
    [LookupType.Country]: [],
    [LookupType.City]: [],
    [LookupType.Currency]: [],
    [LookupType.MerchantCategoryCode]: [],
    [LookupType.Merchant]: [],
    [LookupType.MerchantType]: [
      {
        text: 'Merchant',
        value: 0,
      },
      {
        text: 'Agent',
        value: 1,
      },
      {
        text: 'Biller',
        value: 2,
      },
      {
        text: 'Aggregator',
        value: 3,
      },
    ],
    [LookupType.IdentificationType]: [
      {
        text: 'Commercial Registration',
        value: 0,
      },
      {
        text: 'Service License Number',
        value: 1,
      },
      {
        text: 'Sole Proprietorship License',
        value: 2,
      },
      {
        text: 'National ID',
        value: 3,
      },
    ],
    [LookupType.FeeProfile]: [],
    [LookupType.Wallet]: [],
    [LookupType.Tenant]: [],
    [LookupType.Role]: [],
    [LookupType.Permission]: [],
  };
  filterConfigs: FilterConfig[] = [];
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
          disabled: !this.isAllowed(this.Roles?.ViewRole),
        },
        {
          label: 'users.actions.edit',
          icon: 'edit',
          severity: 'warn',
          disabled: !this.isAllowed(this.Roles?.EditRole),
        },
        {
          label: 'users.actions.delete',
          icon: 'delete',
          severity: 'danger',
          disabled: !this.isAllowed(this.Roles?.DeleteRole),
        },
      ];
    });
  }
  openModel() {
    this.viewMode = false;
    this.editMode = false;
    this.globalServ.setModal(true);
  }

  getAllRoles(filters?: any) {
    this.globalServ.setLoading(true);
    this.globalServ.isSubmitted.set(false);
    this.globalServ.getAllRoles(filters).subscribe({
      next: (data: any) => {
        this.roles = data?.data?.roles;
        this.filterConfigs = data?.data?.stringProperties.map(
          (el: { name: string; type: string; lookUpEnum: LookupType }) => {
            el.lookUpEnum === LookupType.Tenant ? this.getAlltenants() : '';
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
        this.roleId = action.rowData.id;
        return;
      case 'warn':
        this.globalServ.setModal(true);
        this.editMode = true;
        this.roleId = action.rowData.id;
    }
  }
  isAllowed(permission: string) {
    return this.authServ.hasPermission(permission);
  }

  deleteRole(event: any) {
    this.roleServ.deleteRole(event.id).subscribe({
      next: (data: any) => {
        this.message.success(data?.Message);
        this.getAllRoles();
      },
      error: (err) => {
        this.message.success(err?.error?.Message);
      },
    });
  }
  filterTable(event: any) {
    this.getAllRoles(event);
  }
  getAlltenants() {
    this.globalServ.getAllTenantLookups().subscribe({
      next: (data: any) => {
        this.lookups[LookupType.Tenant] = data?.data;
      },
    });
  }
}
