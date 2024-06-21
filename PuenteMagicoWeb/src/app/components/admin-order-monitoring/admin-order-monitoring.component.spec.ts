import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderMonitoringComponent } from './admin-order-monitoring.component';

describe('AdminOrderMonitoringComponent', () => {
  let component: AdminOrderMonitoringComponent;
  let fixture: ComponentFixture<AdminOrderMonitoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrderMonitoringComponent]
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
