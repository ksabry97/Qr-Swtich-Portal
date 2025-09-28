import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesList } from './fees-list';

describe('FeesList', () => {
  let component: FeesList;
  let fixture: ComponentFixture<FeesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeesList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeesList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
