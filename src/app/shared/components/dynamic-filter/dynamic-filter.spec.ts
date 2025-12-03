import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFilter } from './dynamic-filter';

describe('DynamicFilter', () => {
  let component: DynamicFilter;
  let fixture: ComponentFixture<DynamicFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

