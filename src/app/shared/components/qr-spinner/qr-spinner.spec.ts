import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrSpinner } from './qr-spinner';

describe('QrSpinner', () => {
  let component: QrSpinner;
  let fixture: ComponentFixture<QrSpinner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrSpinner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrSpinner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
