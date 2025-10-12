import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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

@Component({
  selector: 'app-add-role',
  imports: [
    CommonModule,
    ModalHeader,
    ModalFooter,
    ReactiveFormsModule,
    QrInput,
    NzSwitchModule,
  ],
  templateUrl: './add-role.html',
  styleUrl: './add-role.scss',
})
export class AddRole {
  permissions = ['add', 'edit', 'delete', 'export'];
  roleGroup!: FormGroup;
  constructor(private fb: FormBuilder) {
    this.roleGroup = this.fb.group({
      roleName: ['', Validators.required],
      isActive: [false],
    });
  }
}
