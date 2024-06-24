import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailCuadernoComponent } from './product-detail-cuaderno.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('ProductDetailCuadernoComponent', () => {
  let component: ProductDetailCuadernoComponent;
  let fixture: ComponentFixture<ProductDetailCuadernoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailCuadernoComponent, CommonModule, RouterModule.forRoot([]), FormsModule, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailCuadernoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
