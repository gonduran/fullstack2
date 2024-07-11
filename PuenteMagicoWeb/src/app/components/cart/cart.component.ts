import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { CustomersService } from '../../services/customers.service';
import { OrdersService } from '../../services/orders.service';
import { Router } from '@angular/router';

/**
 * @description
 * Interface de Carro de Compra.
 */
interface CartItem {
  product: string;
  price: number;
  quantity: number;
  total: number;
  image: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, AfterViewInit {
  cart: CartItem[] = [];
  totalAmount: number = 0;

  /**
   * @description 
   * Constructor del componente. Inicializa los servicios necesarios.
   * 
   * @param {NavigationService} navigationService - Servicio de navegación.
   * @param {Object} platformId - Identificador de la plataforma.
   * @param {CustomersService} customersService - Servicio de clientes.
   * @param {OrdersService} ordersService - Servicio de órdenes.
   * @param {Router} router - Servicio de enrutamiento.
   */
  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private customersService: CustomersService,
    private ordersService: OrdersService,
    private router: Router) { }

  /**
   * @description
   * Hook de inicialización del componente. Verifica el estado de inicio de sesión y carga el carrito.
   * 
   * @return {void}
   */
  ngOnInit(): void {
    this.checkLoginState();
    this.loadCart();
  }

  /**
   * @description
   * Verifica el estado de inicio de sesión del cliente y actualiza la interfaz de usuario en consecuencia.
   * 
   * @return {void}
   */
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

  /**
   * @description
   * Hook que se ejecuta después de que la vista ha sido inicializada. Configura la navegación con retardo para los enlaces.
   * 
   * @return {void}
   */
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
    }
  }

  /**
   * @description
   * Carga el carrito desde el almacenamiento local y calcula el total.
   * 
   * @return {void}
   */
  loadCart(): void {
    if (this.customersService.isLocalStorageAvailable()) {
      this.cart = JSON.parse(localStorage.getItem('carts') || '[]');
    }
    this.calculateTotal();
  }

  /**
   * @description
   * Calcula el monto total del carrito.
   * 
   * @return {void}
   */
  calculateTotal(): void {
    this.totalAmount = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  /**
   * @description
   * Elimina un producto del carrito.
   * 
   * @param {number} index - El índice del producto a eliminar.
   * @return {void}
   */
  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
    this.ordersService.removeFromCart(index);
    this.calculateTotal();
  }

  /**
   * @description
   * Limpia el carrito de compra.
   * 
   * @return {void}
   */
  clearCart(): void {
    this.cart = [];
    this.ordersService.clearCart();
    this.calculateTotal();
  }

  /**
   * @description
   * Realiza el proceso de checkout. Registra la orden y limpia el carrito.
   * 
   * @return {void}
   */
  checkout(): void {
    if (this.checkLoginStateCheckout()) {
      const email = this.customersService.getLoggedInClientEmail();
      const total = this.totalAmount;
      if (this.customersService.isLocalStorageAvailable()) {
        this.cart = JSON.parse(localStorage.getItem('carts') || '[]');
      }
      console.log('Intentando checkout.', this.cart);
      const id = this.ordersService.registerOrder(email, total);
      this.clearCart();
      alert('Pedido #' + id + ' registrado.');
      this.customersService.mostrarAlerta('Pedido #' + id + ' registrado.', 'success');
    }
  }

  /**
   * @description
   * Verifica el estado de inicio de sesión para el proceso de checkout.
   * 
   * @return {boolean} - Retorna true si el cliente está logueado, de lo contrario redirige al login.
   */
  checkLoginStateCheckout(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (this.customersService.checkLoginState()) {
        console.log('Está logueado, se permite checkout.');
        return true;
      } else {
        console.log('No está logueado, no se permite checkout y se redirige al login.');
        this.router.navigate(['/login']);
      }
    }
    return false;
  }
}