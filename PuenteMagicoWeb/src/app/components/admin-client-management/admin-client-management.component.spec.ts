import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClientManagementComponent } from './admin-client-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('AdminClientManagementComponent', () => {
  let component: AdminClientManagementComponent;
  let fixture: ComponentFixture<AdminClientManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminClientManagementComponent, CommonModule, RouterModule.forRoot([]), FormsModule, ReactiveFormsModule]
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
