import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OTPInput } from './otp-input';

describe('OTPInput', () => {
  let component: OTPInput;
  let fixture: ComponentFixture<OTPInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OTPInput]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OTPInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
