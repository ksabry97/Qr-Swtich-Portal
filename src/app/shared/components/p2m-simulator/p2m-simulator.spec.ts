import { ComponentFixture, TestBed } from '@angular/core/testing';

import { P2mSimulator } from './p2m-simulator';

describe('P2mSimulator', () => {
  let component: P2mSimulator;
  let fixture: ComponentFixture<P2mSimulator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [P2mSimulator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(P2mSimulator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
