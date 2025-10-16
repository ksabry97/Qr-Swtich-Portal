import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { ModalHeader } from '../../../../shared/components/modal-header/modal-header';
import { QrInput } from '../../../../shared/components/qr-input/qr-input';
import { QrSelect } from '../../../../shared/components/qr-select/qr-select';
import { QrPassword } from '../../../../shared/components/qr-password/qr-password';
import { GlobalService } from '../../../../shared/services/global.service';
import { UserService } from '../../services/users.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-user',
  imports: [
    CommonModule,
    ModalHeader,
    ModalFooter,
    ReactiveFormsModule,
    QrInput,
    QrSelect,
    QrPassword,
    TranslateModule,
  ],
  templateUrl: './add-user.html',
  styleUrl: './add-user.scss',
})
export class AddUser implements OnInit {
  userForm!: FormGroup;
  globalServ = inject(GlobalService);
  userServ = inject(UserService);
  tenants = [];
  assignedRoles = [];
  constructor(private fb: FormBuilder, private message: NzMessageService) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      // tenantId: ['', Validators.required],
      password: [''],
      assignRoleById: [[]],
    });
  }
  submit() {
    this.globalServ.requestLoading.set(true);
    if (this.userForm.valid) {
      this.userServ.createUser(this.userForm.value).subscribe({
        next: (data: any) => {
          this.globalServ.setModal(false);
          this.globalServ.isSubmitted.set(true);
          this.globalServ.requestLoading.set(false);
          this.message.success(data?.message);
        },
        error: (err) => {
          this.globalServ.requestLoading.set(false);
          this.message.error(err?.error?.message);
        },
      });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  ngOnInit(): void {
    this.getAllRoles();
    // this.getAllTenants();
  }
  getAllRoles() {
    this.globalServ.getAllRoles().subscribe({
      next: (data: any) => {
        const mappedData = data.data.map((value: any) => {
          return { text: value.name, value: value.id };
        });
        this.assignedRoles = mappedData;
      },
    });
  }

  getAllTenants() {
    this.globalServ.getAllTenantLookups().subscribe({
      next: (data: any) => {
        this.tenants = data.data;
      },
    });
  }
}
