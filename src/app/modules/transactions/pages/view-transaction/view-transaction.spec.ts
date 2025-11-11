import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTransaction } from './view-transaction';

describe('ViewTransaction', () => {
  let component: ViewTransaction;
  let fixture: ComponentFixture<ViewTransaction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewTransaction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTransaction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
