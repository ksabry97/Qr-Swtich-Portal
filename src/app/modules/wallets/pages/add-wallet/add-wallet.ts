import {
  Component,
  inject,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { QrSelect } from '../../../../shared/components/qr-select/qr-select';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { ModalHeader } from '../../../../shared/components/modal-header/modal-header';
import { QrInput } from '../../../../shared/components/qr-input/qr-input';
import { QrPassword } from '../../../../shared/components/qr-password/qr-password';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { QrInputNumber } from '../../../../shared/components/qr-input-number/qr-input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { WalletsService } from '../../services/wallets.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GlobalService } from '../../../../shared/services/global.service';
import { TranslateModule } from '@ngx-translate/core';
import { QrTagsInput } from '../../../../shared/components/qr-tags-input/qr-tags-input';
@Component({
  selector: 'app-add-wallet',
  imports: [
    CommonModule,
    ModalHeader,
    ModalFooter,
    ReactiveFormsModule,
    QrInput,
    QrSelect,
    QrPassword,
    QrInputNumber,
    NzIconModule,
    NzSwitchModule,
    TranslateModule,
    QrTagsInput,
  ],
  templateUrl: './add-wallet.html',
  styleUrl: './add-wallet.scss',
})
export class AddWallet implements OnChanges {
  walletServ = inject(WalletsService);
  globalServ = inject(GlobalService);
  walletForm!: FormGroup;
  isOpened = [false, false, false];
  @Input() viewMode = false;
  @Input() walletId = '';
  types = [
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
  walletTypes = [
    {
      text: 'Wallet',
      value: 0,
    },
    {
      text: 'Bank',
      value: 1,
    },
  ];

  constructor(private fb: FormBuilder, private message: NzMessageService) {
    this.walletForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      description: [''],
      prefixes: [[], Validators.required],
      baseUrl: ['', Validators.required],
      port: ['443', Validators.required],
      maxConnections: ['', Validators.required],
      connectionTimeout: ['', Validators.required],
      isHttps: [false],
      apiKey: [''],
      userName: [''],
      userPassword: [''],
      isActive: [false],
      notes: [''],
      enableHealthChecks: [false],
      healthChechInterval: [],
    });
  }
  submit() {
    if (this.walletForm.valid) {
      this.globalServ.requestLoading.set(true);
      this.walletServ.createWallet(this.walletForm.value).subscribe({
        next: (data: any) => {
          if (data.status == 200 || data.status == 201) {
            this.globalServ.setModal(false);
            this.globalServ.isSubmitted.set(true);
            this.message.success(data?.Message);
          } else {
            this.message.error(data?.Message);
          }
          this.globalServ.requestLoading.set(false);
        },
        error: (err) => {
          this.globalServ.requestLoading.set(false);
          this.message.error(err?.error?.Message);
        },
      });
    } else {
      this.walletForm.markAllAsTouched();
      this.isOpened[0] = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viewMode']) {
      if (this.viewMode) {
        this.walletServ.getWalletById(this.walletId).subscribe({
          next: (data: any) => {
            this.walletForm.patchValue(data.data);
          },
        });
      }
    }
  }
}
