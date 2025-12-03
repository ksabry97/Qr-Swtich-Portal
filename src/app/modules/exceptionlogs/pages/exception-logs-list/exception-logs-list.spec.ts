import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionLogsList } from './exception-logs-list';

describe('ExceptionLogsList', () => {
  let component: ExceptionLogsList;
  let fixture: ComponentFixture<ExceptionLogsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExceptionLogsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExceptionLogsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
