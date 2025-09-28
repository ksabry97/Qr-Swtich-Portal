import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntityHeader } from './entity-header';

describe('EntityHeader', () => {
  let component: EntityHeader;
  let fixture: ComponentFixture<EntityHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntityHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntityHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
