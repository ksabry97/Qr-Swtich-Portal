import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrPassword } from './qr-password';

describe('QrPassword', () => {
  let component: QrPassword;
  let fixture: ComponentFixture<QrPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrPassword]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrPassword);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
