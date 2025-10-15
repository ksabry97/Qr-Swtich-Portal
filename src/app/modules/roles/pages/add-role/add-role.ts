import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
  ],
  templateUrl: './add-role.html',
  styleUrl: './add-role.scss',
})
export class AddRole {
  assignedPermissions = [];
  roleGroup!: FormGroup;
  globalServ = inject(GlobalService);
  rolesServ = inject(RolesService);
  constructor(private fb: FormBuilder, private message: NzMessageService) {
    this.roleGroup = this.fb.group({
      roleName: ['', Validators.required],
      description: [''],
      assignPermissionIds: [[], Validators.required],
    });
  }

  submit() {
    if (this.roleGroup.valid) {
      this.rolesServ.createRole(this.roleGroup.value).subscribe({
        next: (data: any) => {
          this.message.success(data.Message);
          this.globalServ.setModal(false);
        },
        error: (err) => {
          this.message.error(err.error.Message);
        },
      });
    } else {
      this.roleGroup.markAllAsTouched();
    }
  }
}
