import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContactManagementComponent } from './admin-contact-management.component';

describe('AdminContactManagementComponent', () => {
  let component: AdminContactManagementComponent;
  let fixture: ComponentFixture<AdminContactManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminContactManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminContactManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
