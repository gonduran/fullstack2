import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailCroqueraComponent } from './product-detail-croquera.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductDetailCroqueraComponent', () => {
  let component: ProductDetailCroqueraComponent;
  let fixture: ComponentFixture<ProductDetailCroqueraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailCroqueraComponent, CommonModule, RouterModule.forRoot([]), FormsModule, ReactiveFormsModule, HttpClientTestingModule]
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
