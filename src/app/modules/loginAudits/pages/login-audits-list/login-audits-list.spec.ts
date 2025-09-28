import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginAuditsList } from './login-audits-list';

describe('LoginAuditsList', () => {
  let component: LoginAuditsList;
  let fixture: ComponentFixture<LoginAuditsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginAuditsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginAuditsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
