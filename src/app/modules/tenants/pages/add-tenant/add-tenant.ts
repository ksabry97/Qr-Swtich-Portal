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
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-add-tenant',
  imports: [
    CommonModule,
    ModalHeader,
    ModalFooter,
    ReactiveFormsModule,
    QrInput,
    QrSelect,
    TranslateModule,
  ],
  templateUrl: './add-tenant.html',
  styleUrl: './add-tenant.scss',
})
export class AddTenant implements OnInit, OnChanges {
  tenantForm!: FormGroup;
  globalServ = inject(GlobalService);
  router = inject(Router);
  @Input() tenantId = '';
  @Input() viewMode = false;
  types: any = [
    {
      text: 'tenants.environmentTypes.development',
      value: 0,
    },
    {
      text: 'tenants.environmentTypes.staging',
      value: 1,
    },
    {
      text: 'tenants.environmentTypes.production',
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
      contantAddress: [''],
    });
  }

  ngOnInit(): void {
    this.getAllCountries();
  }
  submit() {
    if (this.tenantForm.valid) {
      this.globalServ.requestLoading.set(true);
      this.tenantServ.createTenant(this.tenantForm.value).subscribe({
        next: (data: any) => {
          this.globalServ.setModal(false);
          this.globalServ.isSubmitted.set(true);
          this.globalServ.requestLoading.set(false);
          this.message.success(data.message);
        },
        error: (err) => {
          this.globalServ.requestLoading.set(false);
          this.message.error(err?.error?.message);
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viewMode']) {
      if (this.viewMode) {
        this.tenantServ.getTenantById(this.tenantId).subscribe({
          next: (data: any) => {
            this.tenantForm.patchValue(data.data);
          },
        });
      }
    }
  }
}
