import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { TranslateModule } from '@ngx-translate/core';
import { TenantStatus } from '../../../modules/tenants/interfaces/tenants';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filter?: boolean;
  width?: string;
  template?: string;
}

export interface TableAction {
  label: string;
  icon?: string;
  severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger';
  disabled?: boolean;
}
@Component({
  selector: 'app-qr-table',
  imports: [
    CommonModule,
    NzTableModule,
    NzSpinModule,
    NzIconModule,
    TranslateModule,
    NzPopconfirmModule,
  ],
  templateUrl: './qr-table.html',
  styleUrl: './qr-table.scss',
})
export class QrTable<T extends Record<string, any> = any> {
  @Input() columns: TableColumn[] = [];
  @Input() data: T[] = [];
  @Input() loading: boolean = false;
  @Input() paginator: boolean = true;
  @Input() rows: number = 10;
  @Input() rowsPerPageOptions: number[] = [5, 10, 20];
  @Input() actions: TableAction[] = [];
  @Input() total: number = 0;
  @Output() onRowSelect = new EventEmitter<any>();
  @Output() onRowUnselect = new EventEmitter<any>();
  @Output() onRowClick = new EventEmitter<any>();
  @Output() onLazyLoad = new EventEmitter<any>();
  @Output() onActionClick = new EventEmitter<{
    action: TableAction;
    rowData: T;
    rowIndex: number;
  }>();
  @Output() isConfirmed = new EventEmitter<any>();
  @Input() isTenantTable = false;
  tenantStatus = TenantStatus;

  confirm(event: any) {
    this.isConfirmed.emit(event);
  }
}
