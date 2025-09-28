import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrHeader } from './qr-header';

describe('QrHeader', () => {
  let component: QrHeader;
  let fixture: ComponentFixture<QrHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
