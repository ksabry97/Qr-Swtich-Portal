import { Component, Input, Output, EventEmitter, OnInit, Optional, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule, NzModalService, NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

export interface FilterOption {
  text: string;
  value: any;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'switch' | 'date' | 'date-range' | 'string' | 'number';
  options?: FilterOption[];
  placeholder?: string | string[] | any;
  defaultValue?: any;
}

@Component({
  selector: 'app-dynamic-filter',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    NzSelectModule,
    NzSwitchModule,
    NzDatePickerModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzModalModule,
  ],
  templateUrl: './dynamic-filter.html',
  styleUrl: './dynamic-filter.scss',
})
export class DynamicFilter implements OnInit {
  @Input() filterConfigs: FilterConfig[] = [];
  @Input() isModal: boolean = false;
  @Output() filterChange = new EventEmitter<Record<string, any>>();
  @Output() clearFilters = new EventEmitter<void>();

  filters: Record<string, any> = {};

  constructor(
    @Optional() private modalRef?: NzModalRef,
    @Optional() @Inject(NZ_MODAL_DATA) private modalData?: any
  ) {
    // Initialize filters with default values if provided
    this.filters = {};
    
    // If opened in modal, get data from modal
    if (modalData) {
      this.filterConfigs = modalData.filterConfigs || [];
      this.isModal = true;
      // Restore previous filter values if provided
      if (modalData.initialValues) {
        // Deep copy and convert date strings back to Date objects
        this.filters = this.restoreFilterValues(modalData.initialValues, modalData.filterConfigs || []);
      }
    }
  }

  private restoreFilterValues(values: Record<string, any>, configs: FilterConfig[]): Record<string, any> {
    const restored: Record<string, any> = {};
    
    Object.keys(values).forEach((key) => {
      const config = configs.find((c) => c.key === key);
      const value = values[key];
      
      if (config?.type === 'date' && typeof value === 'string') {
        // Convert ISO string back to Date
        restored[key] = new Date(value);
      } else if (config?.type === 'date-range' && Array.isArray(value) && value.length === 2) {
        // Convert date range ISO strings back to Date objects
        restored[key] = [
          typeof value[0] === 'string' ? new Date(value[0]) : value[0],
          typeof value[1] === 'string' ? new Date(value[1]) : value[1],
        ];
      } else {
        restored[key] = value;
      }
    });
    
    return restored;
  }

  static openInModal(
    modalService: NzModalService,
    filterConfigs: FilterConfig[],
    initialValues: Record<string, any> = {},
    onFilterChange: (filters: Record<string, any>) => void,
    onClearFilters?: () => void
  ): NzModalRef {
    const modal = modalService.create({
      nzTitle: 'Filters',
      nzContent: DynamicFilter,
      nzFooter: null,
      nzWidth: '1200px',
      nzBodyStyle: {
        padding: '24px',
      },
      nzData: {
        filterConfigs: filterConfigs,
        isModal: true,
        initialValues: initialValues,
      },
    });

    // Wait for component to be initialized
    modal.afterOpen.subscribe(() => {
      const componentInstance = modal.getContentComponent() as DynamicFilter;
      if (componentInstance) {
        componentInstance.filterChange.subscribe((filters) => {
          onFilterChange(filters);
          modal.close();
        });

        if (onClearFilters) {
          componentInstance.clearFilters.subscribe(() => {
            onClearFilters();
            modal.close();
          });
        }
      }
    });

    return modal;
  }

  ngOnInit() {
    // Set default values from config only if not already set (from initialValues)
    this.filterConfigs.forEach((config) => {
      if (config.defaultValue !== undefined && this.filters[config.key] === undefined) {
        this.filters[config.key] = config.defaultValue;
      }
    });

    // // Emit initial values if any defaults are set
    // this.emitFilters();
  }

  onFilterChange(key: string, value: any): void {
    this.filters[key] = value;
  }

  onDateChange(key: string, date: Date | null): void {
    if (date) {
      this.filters[key] = date;
    } else {
      delete this.filters[key];
    }
  }

  onDateRangeChange(key: string, dates: [Date, Date] | null): void {
    if (dates && dates.length === 2) {
      this.filters[key] = dates;
    } else {
      delete this.filters[key];
    }
  }

  onSwitchChange(key: string, value: boolean): void {
    this.filters[key] = value;
  }

  onInputChange(key: string, value: string | number): void {
    const config = this.filterConfigs.find((c) => c.key === key);
    
    if (config?.type === 'number') {
      // Convert to number, or remove if empty
      if (value === '' || value === null || value === undefined) {
        delete this.filters[key];
      } else {
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        this.filters[key] = isNaN(numValue) ? undefined : numValue;
      }
    } else {
      // String input
      if (value === '' || value === null || value === undefined) {
        delete this.filters[key];
      } else {
        this.filters[key] = value;
      }
    }
  }

  applyFilters(): void {
    this.emitFilters();
    if (this.isModal && this.modalRef) {
      this.modalRef.close();
    }
  }

  clearAllFilters(): void {
    this.filters = {};
    this.emitFilters();
    this.clearFilters.emit();
    if (this.isModal && this.modalRef) {
      this.modalRef.close();
    }
  }

  closeModal(): void {
    if (this.isModal && this.modalRef) {
      this.modalRef.close();
    }
  }

  private emitFilters(): void {
    const activeFilters: Record<string, any> = {};

    // Only include filters that have values
    Object.keys(this.filters).forEach((key) => {
      const value = this.filters[key];

      // Skip null, undefined, empty strings, and empty arrays
      if (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        const config = this.filterConfigs.find((c) => c.key === key);

        if (config?.type === 'date') {
          // Emit ISO string in UTC for single date
          activeFilters[key] =
            value instanceof Date ? value.toISOString() : value;
        } else if (config?.type === 'date-range') {
          // Emit tuple of ISO strings in UTC for date range
          if (Array.isArray(value) && value.length === 2) {
            const [start, end] = value as [Date, Date];
            activeFilters[key] = [
              start instanceof Date ? start.toISOString() : start,
              end instanceof Date ? end.toISOString() : end,
            ];
          } else {
            activeFilters[key] = value;
          }
        } else {
          activeFilters[key] = value;
        }
      }
    });

    this.filterChange.emit(activeFilters);
  }

  hasActiveFilters(): boolean {
    return Object.keys(this.filters).some((key) => {
      const value = this.filters[key];
      return (
        value !== null &&
        value !== undefined &&
        value !== '' &&
        value !== false &&
        !(Array.isArray(value) && value.length === 0)
      );
    });
  }

  getPlaceholderArray(config: FilterConfig): string[] | string {
    if (Array.isArray(config.placeholder)) {
      return config.placeholder;
    }
    // Default placeholders for date range if not provided
    return config.placeholder || ['Start Date', 'End Date'];
  }

  getInputPlaceholder(config: FilterConfig): string {
    if (config.placeholder) {
      return config.placeholder;
    }
    // Default placeholders based on input type
    if (config.type === 'string') {
      return 'Enter text';
    } else if (config.type === 'number') {
      return 'Enter number';
    }
    return '';
  }
}
