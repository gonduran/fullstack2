import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClientManagementComponent } from './admin-client-management.component';

describe('AdminClientManagementComponent', () => {
  let component: AdminClientManagementComponent;
  let fixture: ComponentFixture<AdminClientManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminClientManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminClientManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
