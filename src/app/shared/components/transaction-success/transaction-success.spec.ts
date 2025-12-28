import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TransactionSuccess } from './transaction-success';

describe('TransactionSuccess', () => {
  let component: TransactionSuccess;
  let fixture: ComponentFixture<TransactionSuccess>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [TransactionSuccess],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionSuccess);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to dashboard when goToDashboard is called', () => {
    component.goToDashboard();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });
});



