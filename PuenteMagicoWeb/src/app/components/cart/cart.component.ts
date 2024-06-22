import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { CustomersService } from '../../services/customers.service';
import { OrdersService } from '../../services/orders.service';
import { Router } from '@angular/router';

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

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private customersService: CustomersService,
    private ordersService: OrdersService,
    private router: Router) { }

    ngOnInit(): void {
      this.checkLoginState();
      this.loadCart();
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
    }
  }

  cart: CartItem[] = [];
  totalAmount: number = 0;

  loadCart(): void {
    if (this.customersService.isLocalStorageAvailable()) {
      this.cart = JSON.parse(localStorage.getItem('carts') || '[]');
    }
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.totalAmount = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
    this.ordersService.removeFromCart(index);
    this.calculateTotal();
  }

  clearCart(): void {
    this.cart = [];
    this.ordersService.clearCart();
    this.calculateTotal();
  }

  checkout(): void {
    if (this.checkLoginStateCheckout()){
      //Registrar orden
      const email = this.customersService.getLoggedInClientEmail();
      const total = this.totalAmount;
      const id = this.ordersService.registerOrders(email, total);

      //Registrar detalle de la orden
      this.ordersService.registerOrderdetails(id);

      //Limpiar carrito
      this.clearCart();

      alert('Pedido #' + id + ' registrado.');
    }
  }

  checkLoginStateCheckout(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      if (this.customersService.checkLoginState()) {
        //Esta logueado, se permite checkout
        console.log('Esta logueado, se permite checkout.');
        return true;
      } else {
        //No esta logueado, mo se permite checkout y se redirige al login
        console.log('No esta logueado, no se permite checkout y se redirige al login.');
        this.router.navigate(['/login']);
      }
    }
    return false;
  }

}
