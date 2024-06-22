import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
declare var bootstrap: any;
import { CustomersService } from '../../services/customers.service';
import { Router } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-product-detail-aluminio',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './product-detail-aluminio.component.html',
  styleUrl: './product-detail-aluminio.component.scss'
})
export class ProductDetailAluminioComponent implements OnInit, AfterViewInit {
  addToCartForm: FormGroup;
  quantity: number = 1;
  minQuantity: number = 1;
  maxQuantity: number = 10;

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private customersService: CustomersService,
    private router: Router,
    private ordersService: OrdersService,
	  private fb: FormBuilder) {
      this.addToCartForm = this.fb.group({
      quantity: ['', [Validators.required]]}); 
  }

  ngOnInit(): void {
    this.checkLoginState();
  }

  checkLoginState(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.customersService.checkLoginState()) {
        // Ocultar el menú "Iniciar Sesión" y "Registro Cliente"
        document.getElementById('loginMenu')!.style.display = 'none';
        document.getElementById('registerMenu')!.style.display = 'none';
        // Mostrar el menú "Perfil Cliente" y "Cerrar Sesión"
        document.getElementById('profileMenu')!.style.display = 'block';
        document.getElementById('logoutMenu')!.style.display = 'block';
      } else {
        // Ocultar el menú "Perfil Cliente" y "Cerrar Sesión"
        document.getElementById('profileMenu')!.style.display = 'none';
        document.getElementById('logoutMenu')!.style.display = 'none';
        // Mostrar el menú "Iniciar Sesión" y "Registro Cliente"
        document.getElementById('loginMenu')!.style.display = 'block';
        document.getElementById('registerMenu')!.style.display = 'block';
      }
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const links = document.querySelectorAll('a');
      links.forEach(link => {
        link.addEventListener('click', (event: Event) => {
          event.preventDefault();
          const target = event.target as HTMLElement;
          const href = target.getAttribute('href');
          if (href) {
            this.navigationService.navigateWithDelay(href);
          }
        });
      });
      //Inicializar Carousel() de imagenes
      if (typeof document !== 'undefined') {
        const carouselElement = document.querySelector('#productCarousel') as HTMLElement;
        if (carouselElement) {
          const carousel = new bootstrap.Carousel(carouselElement, {
            interval: 3000, // Cambia de imagen cada 2 segundos
            ride: 'carousel'
          });
        }
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/product-catalog']);
  }

  addToCart(): void {
    let quantity: number = 1;
    if (this.addToCartForm.valid) {
      quantity = this.addToCartForm.value.quantity;
    }

    const price: number = 10000;
    const total = quantity * price;
    const product = 'Lamina alumnio';
    const image = 'assets/images/lamina_aluminio1.png';
    const registroExitoso = this.ordersService.registerCarts(product, image, price, quantity, total);
    if (registroExitoso) {
      console.log('Registro exitoso:', { product, image, price, quantity, total });
    } else {
      console.log('Error en el registro.');
    }
  }
}
