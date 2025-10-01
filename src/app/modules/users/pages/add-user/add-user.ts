import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
  ],
  templateUrl: './add-user.html',
  styleUrl: './add-user.scss',
})
export class AddUser {
  userForm!: FormGroup;
  types = [
    {
      text: 'Development',
      value: '1',
    },
    {
      text: 'Staging',
      value: '2',
    },
    {
      text: 'Production',
      value: '3',
    },
  ];

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      tenantId: [''],
      password: [''],
      confirmPassword: [''],
    });
  }
  submit() {
    console.log(this.userForm.value);
  }
}
