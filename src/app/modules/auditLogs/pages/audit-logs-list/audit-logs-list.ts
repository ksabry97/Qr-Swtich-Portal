import { Component } from '@angular/core';
import { EntityHeader } from '../../../../shared/components/entity-header/entity-header';

@Component({
  selector: 'app-audit-logs-list',
  imports: [EntityHeader],
  templateUrl: './audit-logs-list.html',
  styleUrl: './audit-logs-list.scss',
})
export class AuditLogsList {}
