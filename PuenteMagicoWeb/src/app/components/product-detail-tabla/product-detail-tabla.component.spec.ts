import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailTablaComponent } from './product-detail-tabla.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('ProductDetailTablaComponent', () => {
  let component: ProductDetailTablaComponent;
  let fixture: ComponentFixture<ProductDetailTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailTablaComponent, CommonModule, RouterModule.forRoot([]), FormsModule, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailTablaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
