import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailCuadernoComponent } from './product-detail-cuaderno.component';

describe('ProductDetailCuadernoComponent', () => {
  let component: ProductDetailCuadernoComponent;
  let fixture: ComponentFixture<ProductDetailCuadernoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailCuadernoComponent]
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
