import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { ModalHeader } from '../../../../shared/components/modal-header/modal-header';
import { QrInput } from '../../../../shared/components/qr-input/qr-input';

import { GlobalService } from '../../../../shared/services/global.service';
import { RolesService } from '../../services/roles.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateModule } from '@ngx-translate/core';
import { Permission, Roles } from '../../interfaces/role';

@Component({
  selector: 'app-add-role',
  imports: [
    CommonModule,
    ModalHeader,
    ModalFooter,
    ReactiveFormsModule,
    QrInput,
    NzSwitchModule,

    TranslateModule,
    FormsModule,
  ],
  templateUrl: './add-role.html',
  styleUrl: './add-role.scss',
})
export class AddRole implements OnInit, OnChanges {
  assignedPermissions = [];
  roleGroup!: FormGroup;
  globalServ = inject(GlobalService);
  rolesServ = inject(RolesService);
  @Input() roleId = '';
  @Input() viewMode = false;
  @Input() editMode = false;
  roles: Roles[] = [];
  constructor(private fb: FormBuilder, private message: NzMessageService) {
    this.roleGroup = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      assignPermissionIds: [[], Validators.required],
      Roles: [false],
      AuditLogs: [false],
      Tenants: [false],
      Users: [false],
      Merchants: [false],
      Fees: [false],
      Wallets: [false],
    });
  }

  ngOnInit(): void {
    this.getAllPermissions();
  }
  submit() {
    if (this.roleGroup.valid) {
      this.globalServ.requestLoading.set(true);
      this.editMode ? this.updateRole() : this.createRole();
    } else {
      this.roleGroup.markAllAsTouched();
    }
  }

  getAllPermissions() {
    this.globalServ.getAllPermissions().subscribe({
      next: (data: any) => {
        this.roles = data?.data;
        this.roles.map((role: Roles) => {
          role.permissions.map((perm: Permission) => {
            perm.isAllowed = false;
          });
        });
      },
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viewMode']) {
      if (this.viewMode) {
        this.getRoleById();
      }
    }
    if (changes['editMode']) {
      if (this.editMode) {
        this.getRoleById();
      }
    }
  }

  getRoleById() {
    this.rolesServ.getRoleById(this.roleId).subscribe({
      next: (data: any) => {
        this.roleGroup.patchValue(data.data.role);
        setTimeout(() => {
          this.updatePermissions(data);
        }, 500);
      },
    });
  }
  createRole() {
    this.rolesServ.createRole(this.roleGroup.value).subscribe({
      next: (data: any) => {
        this.globalServ.setModal(false);
        this.globalServ.requestLoading.set(false);
        this.globalServ.isSubmitted.set(true);
        this.message.success(data?.message);
      },
      error: (err) => {
        this.globalServ.requestLoading.set(false);
        this.message.error(err?.error?.message);
      },
    });
  }
  updateRole() {
    let description = this.roleGroup.value.description;
    let assignRoleById = this.roleGroup.value.assignPermissionIds;
    this.rolesServ
      .updateRole(this.roleId, description, assignRoleById)
      .subscribe({
        next: (data: any) => {
          this.globalServ.setModal(false);
          this.globalServ.requestLoading.set(false);
          this.globalServ.isSubmitted.set(true);
          this.message.success(data?.message);
        },
        error: (err) => {
          this.globalServ.requestLoading.set(false);
          this.message.error(err?.error?.message);
        },
      });
  }
  updatePermissions(data: any) {
    let permissionIds: any[] = [];
    data.data.permissions.forEach((perm: any) => {
      permissionIds.push(perm.id);
      this.roles.forEach((role: Roles) => {
        role.resource == perm.resource
          ? this.roleGroup.get(role.resource)?.patchValue(true)
          : this.roleGroup.get(role.resource)?.patchValue(false);
        role.permissions.forEach((permission: Permission) => {
          permission.id === perm.id ? (permission.isAllowed = true) : '';
        });
      });
    });

    this.roleGroup.get('assignPermissionIds')?.patchValue(permissionIds);
  }
  updatePermssion(event: boolean | any, id: string) {
    let permissionIds = this.roleGroup.get('assignPermissionIds')
      ?.value as Array<string>;
    if (event) {
      permissionIds.push(id);
    } else {
      let permIndex = permissionIds.indexOf(id);
      permIndex !== -1 ? permissionIds.splice(permIndex, 1) : '';
    }
    this.roleGroup.get('assignPermissionIds')?.patchValue(permissionIds);
  }
}
