import { ComponentFixture, TestBed } from '@angular/core/testing';

import { M2mSimulator } from './m2m-simulator';

describe('M2mSimulator', () => {
  let component: M2mSimulator;
  let fixture: ComponentFixture<M2mSimulator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [M2mSimulator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(M2mSimulator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
