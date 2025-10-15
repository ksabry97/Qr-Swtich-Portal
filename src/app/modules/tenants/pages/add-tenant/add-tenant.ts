import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
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
import { GlobalService } from '../../../../shared/services/global.service';
import { Router } from '@angular/router';

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
export class AddTenant implements OnInit {
  tenantForm!: FormGroup;
  globalServ = inject(GlobalService);
  router = inject(Router);
  types: any = [
    {
      text: 'Development',
      value: 0,
    },
    {
      text: 'Staging',
      value: 1,
    },
    {
      text: 'Production',
      value: 2,
    },
  ];
  countries = [];
  constructor(
    private fb: FormBuilder,
    private readonly tenantServ: TenantService,
    private message: NzMessageService
  ) {
    this.tenantForm = this.fb.group({
      tenantName: ['', Validators.required],
      countryCode: ['', Validators.required],
      environment: ['', Validators.required],
      description: [''],
      contactEmail: [''],
      contactPhone: [''],
      contactName: [''],
      contactAddress: [''],
    });
  }

  ngOnInit(): void {
    this.getAllCountries();
  }
  submit() {
    if (this.tenantForm.valid) {
      this.tenantServ.createTenant(this.tenantForm.value).subscribe({
        next: (data: any) => {
          this.message.success(data.message);
          this.globalServ.setModal(false);
          this.globalServ.isSubmitted.set(true);
        },
        error: (err) => {
          this.message.error('endpoint failed');
        },
      });
    } else {
      this.tenantForm.markAllAsTouched();
    }
  }

  getAllCountries() {
    this.globalServ.getAllCountries().subscribe({
      next: (data: any) => {
        const mappedCountries = data.data.map((value: any) => {
          return {
            text: value.text,
            value: String(value.value),
          };
        });
        this.countries = mappedCountries;
      },
    });
  }
}
