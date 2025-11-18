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
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ModalFooter } from '../../../../shared/components/modal-footer/modal-footer';
import { ModalHeader } from '../../../../shared/components/modal-header/modal-header';
import { QrInput } from '../../../../shared/components/qr-input/qr-input';
import { QrSelect } from '../../../../shared/components/qr-select/qr-select';
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
    TranslateModule,
  ],
  templateUrl: './add-user.html',
  styleUrl: './add-user.scss',
})
export class AddUser implements OnInit, OnChanges {
  userForm!: FormGroup;
  globalServ = inject(GlobalService);
  userServ = inject(UserService);
  tenants = [];
  assignedRoles = [];
  errorMessages: string[] = [];
  @Input() userId = '';
  @Input() viewMode = false;
  @Input() editMode = false;
  constructor(private fb: FormBuilder, private message: NzMessageService) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      assignRoleById: [[]],
    });
  }
  submit() {
    if (this.userForm.valid) {
      this.globalServ.requestLoading.set(true);
      this.editMode ? this.updateUser() : this.createUser();
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  ngOnInit(): void {
    this.getAllRoles();
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viewMode']) {
      if (this.viewMode) {
        this.userServ.getUserById(this.userId).subscribe({
          next: (data: any) => {
            this.userForm.patchValue(data);
            this.userForm.patchValue({ assignRoleById: data.roles });
          },
        });
      }
    }
    if (changes['editMode']) {
      if (this.editMode) {
        this.userServ.getUserById(this.userId).subscribe({
          next: (data: any) => {
            this.userForm.patchValue(data);
          },
        });
      }
    }
  }

  createUser() {
    this.userServ.createUser(this.userForm.value).subscribe({
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
  }
  updateUser() {
    this.userServ.updateUser(this.userId, this.userForm.value).subscribe({
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
  }

  validate() {
    this.errorMessages = [];
    const passwordControl = this.userForm.get('password');
    const requirements = passwordControl?.errors?.['passwordRequirements'];

    for (const [key, value] of Object.entries(requirements)) {
      let error = `${key}: ${value}` || '';
      this.errorMessages.push(error);
    }
  }
}
