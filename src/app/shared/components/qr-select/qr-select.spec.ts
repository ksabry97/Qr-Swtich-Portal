import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrSelect } from './qr-select';

describe('QrSelect', () => {
  let component: QrSelect;
  let fixture: ComponentFixture<QrSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
