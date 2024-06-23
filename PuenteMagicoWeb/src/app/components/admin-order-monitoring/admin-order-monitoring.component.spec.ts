import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderMonitoringComponent } from './admin-order-monitoring.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('AdminOrderMonitoringComponent', () => {
  let component: AdminOrderMonitoringComponent;
  let fixture: ComponentFixture<AdminOrderMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrderMonitoringComponent, CommonModule, RouterModule.forRoot([]), FormsModule, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOrderMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
