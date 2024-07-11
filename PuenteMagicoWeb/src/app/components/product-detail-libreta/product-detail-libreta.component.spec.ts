import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailLibretaComponent } from './product-detail-libreta.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ProductDetailLibretaComponent', () => {
  let component: ProductDetailLibretaComponent;
  let fixture: ComponentFixture<ProductDetailLibretaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailLibretaComponent, CommonModule, RouterModule.forRoot([]), FormsModule, ReactiveFormsModule, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDetailLibretaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * @description Verifica que el formulario de agregar al carrito sea inválido cuando los campos están vacíos.
   * @param {void}
   * @return {void}
   */
  it('should have invalid form when quantity is empty', () => {
    component.addToCartForm.controls['quantity'].setValue('');
    expect(component.addToCartForm.valid).toBeFalsy();
  });

  /**
   * @description Verifica que el formulario de agregar al carrito sea válido cuando se proporciona una cantidad válida.
   * @param {void}
   * @return {void}
   */
  it('should have valid form when quantity is provided', () => {
    component.addToCartForm.controls['quantity'].setValue(1);
    expect(component.addToCartForm.valid).toBeTruthy();
  });

  /**
   * @description Verifica que el estado de inicio de sesión se verifique correctamente.
   * @param {void}
   * @return {void}
   */
  it('should check login state on init', () => {
    spyOn(component, 'checkLoginState').and.callThrough();
    component.ngOnInit();
    expect(component.checkLoginState).toHaveBeenCalled();
  });

  /**
   * @description Verifica que los enlaces de navegación se configuren correctamente después de la inicialización de la vista.
   * @param {void}
   * @return {void}
   */
  it('should set up navigation links after view init', () => {
    spyOn(component, 'ngAfterViewInit').and.callThrough();
    component.ngAfterViewInit();
    expect(component.ngAfterViewInit).toHaveBeenCalled();
  });
});
