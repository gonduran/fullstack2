import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailAluminioComponent } from './product-detail-aluminio.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductDetailAluminioComponent', () => {
  let component: ProductDetailAluminioComponent;
  let fixture: ComponentFixture<ProductDetailAluminioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailAluminioComponent, CommonModule, RouterModule.forRoot([]), FormsModule, ReactiveFormsModule, HttpClientTestingModule]
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
