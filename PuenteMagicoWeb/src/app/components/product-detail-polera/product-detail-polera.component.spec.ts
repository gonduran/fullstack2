import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailPoleraComponent } from './product-detail-polera.component';

describe('ProductDetailPoleraComponent', () => {
  let component: ProductDetailPoleraComponent;
  let fixture: ComponentFixture<ProductDetailPoleraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailPoleraComponent]
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
