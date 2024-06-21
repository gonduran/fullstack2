import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailLibretaComponent } from './product-detail-libreta.component';

describe('ProductDetailLibretaComponent', () => {
  let component: ProductDetailLibretaComponent;
  let fixture: ComponentFixture<ProductDetailLibretaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailLibretaComponent]
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
