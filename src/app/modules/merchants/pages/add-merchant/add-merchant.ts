import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
} from '@angular/forms';
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { ModalHeader } from '../../../../shared/components/modal-header/modal-header';
import { QrInput } from '../../../../shared/components/qr-input/qr-input';
import { QrSelect } from '../../../../shared/components/qr-select/qr-select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzMessageService } from 'ng-zorro-antd/message';
import { MerchantService } from '../../services/merchants.service';
import { GlobalService } from '../../../../shared/services/global.service';
import { forkJoin } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

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
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './add-merchant.html',
  styleUrl: './add-merchant.scss',
})
export class AddMerchant implements OnInit {
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
  cities = [];
  identificationTypes = [
    {
      text: 'Commercial Registration',
      value: 0,
    },
    {
      text: 'Service License Number',
      value: 1,
    },
    {
      text: 'Sole Proprietorship License',
      value: 2,
    },
    {
      text: 'National ID',
      value: 3,
    },
  ];

  lang: number | null = null;
  lat: number | null = null;
  countries = [];
  mccs = [];
  feesProfiles = [];
  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private readonly merchantServ: MerchantService
  ) {
    this.getUserLocation();
    this.merchantForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(64)]],
      scheme: ['', [Validators.required, Validators.maxLength(64)]],
      msisdn: ['', [Validators.minLength(14), Validators.maxLength(14)]],
      merchantId: ['', [Validators.minLength(9), Validators.maxLength(9)]],
      commercialRegNo: [''],
      issuancePlaceCode: ['', Validators.maxLength(4)],
      nationalId: [''],
      soleProprietorshipLicense: [''],
      serviceLicenseNumber: [''],
      mcc: ['', Validators.required],
      canPerformRegistration: [false],
      // parentId: [
      //   '',
      //   [
      //     Validators.minLength(14),
      //     Validators.maxLength(14),
      //     Validators.required,
      //   ],
      // ],
      countryId: ['', Validators.required],
      cityId: ['', Validators.required],
      contactEmail: ['', Validators.email],
      contactPhone: [''],
      address: ['', Validators.required],
      lang: [this.lang],
      lat: [this.lat],
      feeProfileId: [null],
      merchantType: [, Validators.required],
      identificationType: [, Validators.required],
    });
  }
  ngOnInit(): void {
    forkJoin({
      countries: this.globalServ.getAllCountries(),
      mccs: this.globalServ.getMccs(),
      fees: this.globalServ.getAllfeesLookups(),
    }).subscribe({
      next: (data: any) => {
        this.countries = data.countries?.data;
        this.mccs = data.mccs?.data;
        this.feesProfiles = data.fees?.data;
      },
    });
  }
  submit() {
    if (this.merchantForm.valid) {
      this.globalServ.requestLoading.set(true);
      this.merchantServ.createMerchant(this.merchantForm.value).subscribe({
        next: (data: any) => {
          this.globalServ.setModal(false);
          this.globalServ.isSubmitted.set(true);
          this.globalServ.requestLoading.set(false);
          this.message.success(data?.Message);
        },
        error: (err) => {
          this.globalServ.requestLoading.set(false);
          this.message.error(err?.error?.Message);
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

  getCity(countryId: number) {
    this.merchantForm.patchValue({ cityId: '' });
    this.globalServ.getCitiesByCountryId(countryId).subscribe({
      next: (data: any) => {
        this.cities = data.data;
      },
    });
  }
  updateValidation(event: number) {
    const controlsToClear = [
      'commercialRegNo',
      'serviceLicenseNumber',
      'soleProprietorshipLicense',
      'nationalId',
    ];

    controlsToClear.forEach((controlName) => {
      const control = this.merchantForm.get(controlName);
      if (control) {
        control.clearValidators();
        control.updateValueAndValidity({ emitEvent: false });
      }
    });

    switch (event) {
      case 0:
        this.merchantForm
          .get('commercialRegNo')
          ?.addValidators([Validators.required, Validators.maxLength(15)]);
        this.merchantForm.get('commercialRegNo')?.updateValueAndValidity();
        break;

      case 1:
        this.merchantForm
          .get('serviceLicenseNumber')
          ?.addValidators([Validators.required]);
        this.merchantForm.get('serviceLicenseNumber')?.updateValueAndValidity();
        break;

      case 2:
        this.merchantForm
          .get('soleProprietorshipLicense')
          ?.addValidators([Validators.required, Validators.maxLength(15)]);
        this.merchantForm
          .get('soleProprietorshipLicense')
          ?.updateValueAndValidity();
        break;

      case 3:
        this.merchantForm
          .get('nationalId')
          ?.addValidators([
            Validators.required,
            Validators.minLength(15),
            Validators.maxLength(15),
          ]);
        this.merchantForm.get('nationalId')?.updateValueAndValidity();
        break;
    }
  }
}
