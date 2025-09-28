import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrTable } from './qr-table';

describe('QrTable', () => {
  let component: QrTable;
  let fixture: ComponentFixture<QrTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
