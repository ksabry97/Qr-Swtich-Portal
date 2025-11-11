import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletsSimulator } from './wallets-simulator';

describe('WalletsSimulator', () => {
  let component: WalletsSimulator;
  let fixture: ComponentFixture<WalletsSimulator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletsSimulator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletsSimulator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
