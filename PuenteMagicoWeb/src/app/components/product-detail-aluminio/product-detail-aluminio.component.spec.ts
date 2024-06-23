import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailAluminioComponent } from './product-detail-aluminio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('ProductDetailAluminioComponent', () => {
  let component: ProductDetailAluminioComponent;
  let fixture: ComponentFixture<ProductDetailAluminioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailAluminioComponent, CommonModule, RouterModule.forRoot([]), FormsModule, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailAluminioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
