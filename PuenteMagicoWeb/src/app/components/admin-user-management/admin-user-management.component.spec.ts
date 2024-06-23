import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserManagementComponent } from './admin-user-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('AdminUserManagementComponent', () => {
  let component: AdminUserManagementComponent;
  let fixture: ComponentFixture<AdminUserManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminUserManagementComponent, CommonModule, RouterModule.forRoot([]), FormsModule, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
