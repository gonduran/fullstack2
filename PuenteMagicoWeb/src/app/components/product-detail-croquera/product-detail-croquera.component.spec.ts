import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailCroqueraComponent } from './product-detail-croquera.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('ProductDetailCroqueraComponent', () => {
  let component: ProductDetailCroqueraComponent;
  let fixture: ComponentFixture<ProductDetailCroqueraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailCroqueraComponent, CommonModule, RouterModule.forRoot([]), FormsModule, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailCroqueraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
