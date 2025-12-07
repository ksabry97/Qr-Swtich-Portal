import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DynamicFilter, FilterConfig } from '../dynamic-filter/dynamic-filter';

@Component({
  selector: 'app-table-filter',
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './table-filter.html',
  styleUrl: './table-filter.scss',
})
export class TableFilter {
  searchQuery: string = '';
  @Input() isSelected = false;
  @Input() showDeleteButton = false;
  @Input() filterConfigs: FilterConfig[] = [];
  @Output() search = new EventEmitter<string>();
  @Output() deleteIsClicked = new EventEmitter<boolean>();
  @Output() filters = new EventEmitter<any>();
  
  private modalService = inject(NzModalService);
  private currentFilterValues: Record<string, any> = {};

  emitSearch() {
    this.search.emit(this.searchQuery);
  }

  delete() {
    this.deleteIsClicked.emit(true);
  }

  emitFilters(event: any) {
    this.currentFilterValues = { ...event };
    this.filters.emit(event);
  }

  toggleFilter() {
    DynamicFilter.openInModal(
      this.modalService,
      this.filterConfigs,
      this.currentFilterValues,
      (filters) => {
        this.emitFilters(filters);
      },
      () => {
        this.currentFilterValues = {};
        this.emitFilters({});
      }
    );
  }
  
  constructor(private eRef: ElementRef) {}
  // 👇 Detect clicks anywhere in the document
  // @HostListener('document:click', ['$event'])
  // handleClickOutside(event: MouseEvent) {
  //   // If click is outside the component's element, close filter
  //   if (this.showFilter && !this.eRef.nativeElement.contains(event.target)) {
  //     this.showFilter = false;
  //   }
  // }
}
