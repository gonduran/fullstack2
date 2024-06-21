import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailTablaComponent } from './product-detail-tabla.component';

describe('ProductDetailTablaComponent', () => {
  let component: ProductDetailTablaComponent;
  let fixture: ComponentFixture<ProductDetailTablaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailTablaComponent]
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
