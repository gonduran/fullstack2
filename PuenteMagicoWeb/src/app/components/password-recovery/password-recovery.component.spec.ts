import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordRecoveryComponent } from './password-recovery.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('PasswordRecoveryComponent', () => {
  let component: PasswordRecoveryComponent;
  let fixture: ComponentFixture<PasswordRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasswordRecoveryComponent, CommonModule, RouterModule.forRoot([]), FormsModule, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
