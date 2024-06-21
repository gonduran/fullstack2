import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailCroqueraComponent } from './product-detail-croquera.component';

describe('ProductDetailCroqueraComponent', () => {
  let component: ProductDetailCroqueraComponent;
  let fixture: ComponentFixture<ProductDetailCroqueraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailCroqueraComponent]
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
