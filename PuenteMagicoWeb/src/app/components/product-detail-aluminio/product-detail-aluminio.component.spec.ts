import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailAluminioComponent } from './product-detail-aluminio.component';

describe('ProductDetailAluminioComponent', () => {
  let component: ProductDetailAluminioComponent;
  let fixture: ComponentFixture<ProductDetailAluminioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailAluminioComponent]
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
