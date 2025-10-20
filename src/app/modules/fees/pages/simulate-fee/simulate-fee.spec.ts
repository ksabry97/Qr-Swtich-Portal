import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulateFee } from './simulate-fee';

describe('SimulateFee', () => {
  let component: SimulateFee;
  let fixture: ComponentFixture<SimulateFee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulateFee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulateFee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
