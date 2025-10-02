import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrDatePicker } from './qr-date-picker';

describe('QrDatePicker', () => {
  let component: QrDatePicker;
  let fixture: ComponentFixture<QrDatePicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrDatePicker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrDatePicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
