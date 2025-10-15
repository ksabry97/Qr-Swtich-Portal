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

@Component({
  selector: 'app-roles-list',
  imports: [EntityHeader, QrTable, QrModal],
  templateUrl: './roles-list.html',
  styleUrl: './roles-list.scss',
})
export class RolesList implements OnInit {
  addRole = AddRole;
  globalServ = inject(GlobalService);
  columns: TableColumn[] = [
    { field: 'id', header: 'ID', width: '100px', sortable: false },
    { field: 'name', header: 'Role Name', sortable: false },
    {
      field: 'description',
      header: 'Description',
      sortable: false,
    },
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
      label: 'Delete',
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
    this.globalServ.getAllRoles().subscribe({
      next: (data: any) => {
        this.roles = data.data;
      },
    });
  }
}
