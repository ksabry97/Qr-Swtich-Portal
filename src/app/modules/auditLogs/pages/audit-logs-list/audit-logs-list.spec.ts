import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLogsList } from './audit-logs-list';

describe('AuditLogsList', () => {
  let component: AuditLogsList;
  let fixture: ComponentFixture<AuditLogsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuditLogsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditLogsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
