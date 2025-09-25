import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrInput } from './qr-input';

describe('QrInput', () => {
  let component: QrInput;
  let fixture: ComponentFixture<QrInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
