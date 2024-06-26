import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailLibretaComponent } from './product-detail-libreta.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

describe('ProductDetailLibretaComponent', () => {
  let component: ProductDetailLibretaComponent;
  let fixture: ComponentFixture<ProductDetailLibretaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailLibretaComponent, CommonModule, RouterModule.forRoot([]), FormsModule, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailLibretaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
