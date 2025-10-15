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

@Component({
  selector: 'app-roles-list',
  imports: [EntityHeader, QrTable, QrModal, TranslateModule],
  templateUrl: './roles-list.html',
  styleUrl: './roles-list.scss',
})
export class RolesList implements OnInit {
  addRole = AddRole;
  globalServ = inject(GlobalService);
  columns: TableColumn[] = [
    { field: 'id', header: 'roles.table.id', width: '100px', sortable: false },
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
      severity: 'info',
    },
    {
      label: 'roles.actions.delete',
      icon: 'delete',
      severity: 'info',
    },
  ];

  roles = [];

  constructor() {
    effect(() => {
      this.globalServ.isSubmitted() ? this.getAllRoles() : '';
    });
  }
  ngOnInit(): void {
    this.getAllRoles();
  }
  openModel() {
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
}
