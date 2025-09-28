import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrSidebar } from './qr-sidebar';

describe('QrSidebar', () => {
  let component: QrSidebar;
  let fixture: ComponentFixture<QrSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrSidebar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrSidebar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
