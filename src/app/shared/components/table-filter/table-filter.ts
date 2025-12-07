import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicFilter, FilterConfig } from '../dynamic-filter/dynamic-filter';

@Component({
  selector: 'app-table-filter',
  imports: [CommonModule, FormsModule, TranslateModule, DynamicFilter],
  templateUrl: './table-filter.html',
  styleUrl: './table-filter.scss',
})
export class TableFilter {
  searchQuery: string = '';
  showFilter = true;
  @Input() isSelected = false;
  @Input() showDeleteButton = false;
  @Input() filterConfigs: FilterConfig[] = [];
  @Output() search = new EventEmitter<string>();
  @Output() deleteIsClicked = new EventEmitter<boolean>();
  @Output() filters = new EventEmitter<any>();
  emitSearch() {
    this.search.emit(this.searchQuery);
  }

  delete() {
    this.deleteIsClicked.emit(true);
  }

  emitFilters(event: any) {
    this.filters.emit(event);
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
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
