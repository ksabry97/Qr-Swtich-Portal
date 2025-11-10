import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ModalHeader } from '../../../../shared/components/modal-header/modal-header';
import { AdditionalData, ChangedProperty } from '../../interfaces/audit';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-audit',
  imports: [ModalHeader, CommonModule],
  templateUrl: './view-audit.html',
  styleUrl: './view-audit.scss',
})
export class ViewAudit implements OnChanges {
  tableData: ChangedProperty[] = [];
  @Input() additionalData!: AdditionalData;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['additionalData']) {
      this.tableData = this.additionalData?.EntityChanges?.flatMap((change) =>
        change.changedProperties.map((prop) => ({
          property: prop.property,
          oldValue: prop.oldValue,
          newValue: prop.newValue,
        }))
      );
      console.log(this.tableData);
    }
  }
}
