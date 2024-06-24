import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailPoleraComponent } from './product-detail-polera.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('ProductDetailPoleraComponent', () => {
  let component: ProductDetailPoleraComponent;
  let fixture: ComponentFixture<ProductDetailPoleraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailPoleraComponent, CommonModule, RouterModule.forRoot([]), FormsModule, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailPoleraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
