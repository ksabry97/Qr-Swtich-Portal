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
import { TenantService } from '../../services/tenants.service';
import { NzMessageService } from 'ng-zorro-antd/message';

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
      value: '0',
    },
    {
      text: 'Staging',
      value: '1',
    },
    {
      text: 'Production',
      value: '2',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private readonly tenantServ: TenantService,
    private message: NzMessageService
  ) {
    this.tenantForm = this.fb.group({
      tenantName: ['', Validators.required],
      tenantCode: ['', Validators.required],
      country: ['', Validators.required],
      environment: ['', Validators.required],
      description: [''],
      contactEmail: [''],
      contactPhone: [''],
      contactName: [''],
      contactAddress: [''],
    });
  }
  submit() {
    if (this.tenantForm.valid) {
      this.tenantServ.createTenant(this.tenantForm.value).subscribe({
        next: (data: any) => {},
        error: (err) => {
          this.message.error('endpoint failed');
        },
      });
    } else {
      this.tenantForm.markAllAsTouched();
    }
    console.log(this.tenantForm.value);
  }
}
