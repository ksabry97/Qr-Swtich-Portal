import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletWindow } from './wallet-window';

describe('WalletWindow', () => {
  let component: WalletWindow;
  let fixture: ComponentFixture<WalletWindow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletWindow]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletWindow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
