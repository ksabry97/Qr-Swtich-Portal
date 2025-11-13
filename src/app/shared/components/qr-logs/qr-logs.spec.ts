import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrLogs } from './qr-logs';

describe('QrLogs', () => {
  let component: QrLogs;
  let fixture: ComponentFixture<QrLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrLogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
