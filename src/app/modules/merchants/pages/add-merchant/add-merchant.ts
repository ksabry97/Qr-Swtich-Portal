import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MerchantService } from '../../services/merchants.service';
import { GlobalService } from '../../../../shared/services/global.service';

@Component({
  selector: 'app-add-merchant',
  imports: [
    CommonModule,
    ModalHeader,
    ModalFooter,
    ReactiveFormsModule,
    QrInput,
    QrSelect,
    NzSwitchModule,
  ],
  templateUrl: './add-merchant.html',
  styleUrl: './add-merchant.scss',
})
export class AddMerchant {
  globalServ = inject(GlobalService);
  merchantForm!: FormGroup;
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

  merchantTypes = [
    {
      text: 'Merchant',
      value: '0',
    },
    {
      text: 'Agent',
      value: '1',
    },
    {
      text: 'Biller',
      value: '2',
    },
    {
      text: 'Aggregator',
      value: '3',
    },
  ];

  lang: number | null = null;
  lat: number | null = null;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private readonly merchantServ: MerchantService
  ) {
    this.getUserLocation();
    this.merchantForm = this.fb.group({
      name: ['', Validators.required],
      scheme: ['', Validators.required],
      msisdn: [''],
      merchantId: [''],
      commercialRegNo: [''],
      issuancePlaceCode: [''],
      nationalId: [''],
      soleProprietorshipLicense: [''],
      serviceLicenseNumber: [''],
      mcc: ['', Validators.required],
      canPerformRegistration: [false],
      parentId: [''],
      countryId: ['', Validators.required],
      cityId: [''],
      contactEmail: ['', Validators.email],
      contactPhone: [''],
      address: ['', Validators.required],
      lang: [this.lang],
      lat: [this.lat],
      feeProfileId: [null],
      merchantType: [],
    });
  }
  submit() {
    console.log(this.merchantForm.value);
    if (this.merchantForm.valid) {
      this.merchantServ.createMerchant(this.merchantForm.value).subscribe({
        next: (data: any) => {},
        error: (err) => {
          this.message.error('endpoint failed');
        },
      });
    } else {
      this.merchantForm.markAllAsTouched();
    }
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.lat = position.coords.latitude;
          this.lang = position.coords.longitude;
          this.merchantForm.patchValue({ lang: this.lang, lat: this.lat });
          console.log(`Latitude: ${this.lat}, Longitude: ${this.lang}`);
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              this.message.error('User denied the request for Geolocation.');
              break;
            case error.POSITION_UNAVAILABLE:
              this.message.error('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              this.message.error('The request to get user location timed out.');
              break;
          }
        }
      );
    } else {
      this.message.error('Geolocation is not supported by this browser.');
    }
  }
}
