import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAudit } from './view-audit';

describe('ViewAudit', () => {
  let component: ViewAudit;
  let fixture: ComponentFixture<ViewAudit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewAudit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewAudit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
