import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLogoutComponent } from './admin-logout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('AdminLogoutComponent', () => {
  let component: AdminLogoutComponent;
  let fixture: ComponentFixture<AdminLogoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLogoutComponent, CommonModule, RouterModule.forRoot([]), FormsModule, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLogoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
