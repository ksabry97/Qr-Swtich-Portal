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
} from '@angular/forms';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { ModalHeader } from '../../../../shared/components/modal-header/modal-header';
import { QrInput } from '../../../../shared/components/qr-input/qr-input';
import { QrSelect } from '../../../../shared/components/qr-select/qr-select';
import { GlobalService } from '../../../../shared/services/global.service';
import { RolesService } from '../../services/roles.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-role',
  imports: [
    CommonModule,
    ModalHeader,
    ModalFooter,
    ReactiveFormsModule,
    QrInput,
    NzSwitchModule,
    QrSelect,
    TranslateModule,
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
  constructor(private fb: FormBuilder, private message: NzMessageService) {
    this.roleGroup = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      assignPermissionIds: [[], Validators.required],
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
        this.assignedPermissions = data.data;
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
        let permissions = data.data.compositeRoles.map((data: any) => {
          return data.id;
        });
        this.roleGroup.patchValue({ assignPermissionIds: permissions });
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
}
