import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletList } from './wallet-list';

describe('WalletList', () => {
  let component: WalletList;
  let fixture: ComponentFixture<WalletList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
