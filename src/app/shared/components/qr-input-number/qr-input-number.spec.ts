import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrInputNumber } from './qr-input-number';

describe('QrInputNumber', () => {
  let component: QrInputNumber;
  let fixture: ComponentFixture<QrInputNumber>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrInputNumber]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrInputNumber);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
