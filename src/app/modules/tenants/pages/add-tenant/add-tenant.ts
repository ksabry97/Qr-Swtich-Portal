import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { ModalHeader } from '../../../../shared/components/modal-header/modal-header';
import { QrInput } from '../../../../shared/components/qr-input/qr-input';
import { QrSelect } from '../../../../shared/components/qr-select/qr-select';

@Component({
  selector: 'app-add-tenant',
  imports: [
    CommonModule,
    ModalHeader,
    ModalFooter,
    ReactiveFormsModule,
    QrInput,
    QrSelect,
  ],
  templateUrl: './add-tenant.html',
  styleUrl: './add-tenant.scss',
})
export class AddTenant {
  tenantForm!: FormGroup;
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
    this.tenantForm = this.fb.group({
      tenantName: ['', Validators.required],
      tenantCode: ['', Validators.required],
      countryId: ['', Validators.required],
      environmentId: ['', Validators.required],
      description: [''],
      contactEmail: [''],
      contactPhone: [''],
      contactName: [''],
      contactAddress: [''],
    });
  }
  submit() {
    console.log(this.tenantForm.value);
  }
}
