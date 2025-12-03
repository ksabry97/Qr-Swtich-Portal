import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunicationLogsList } from './communication-logs-list';

describe('CommunicationLogsList', () => {
  let component: CommunicationLogsList;
  let fixture: ComponentFixture<CommunicationLogsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunicationLogsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunicationLogsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
