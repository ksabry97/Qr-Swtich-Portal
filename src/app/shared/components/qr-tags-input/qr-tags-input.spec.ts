import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrTagsInput } from './qr-tags-input';

describe('QrTagsInput', () => {
  let component: QrTagsInput;
  let fixture: ComponentFixture<QrTagsInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrTagsInput],
    }).compileComponents();

    fixture = TestBed.createComponent(QrTagsInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


