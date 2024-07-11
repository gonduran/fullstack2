import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminContactManagementComponent } from './admin-contact-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdminContactManagementComponent', () => {
  let component: AdminContactManagementComponent;
  let fixture: ComponentFixture<AdminContactManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminContactManagementComponent, CommonModule, RouterModule.forRoot([]), FormsModule, ReactiveFormsModule, HttpClientTestingModule]
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
