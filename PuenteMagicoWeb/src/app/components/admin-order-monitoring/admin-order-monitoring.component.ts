import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersService, Order, OrderDetail } from '../../services/orders.service';

@Component({
  selector: 'app-admin-order-monitoring',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './admin-order-monitoring.component.html',
  styleUrls: ['./admin-order-monitoring.component.scss']
})
export class AdminOrderMonitoringComponent implements OnInit, AfterViewInit {
  orders: Order[] = [];
  selectedOrderDetails: OrderDetail[] = [];
  selectedOrderId: number | null = null;
  statusForm: FormGroup;

  /**
   * @description 
   * Constructor del componente. Inicializa los servicios necesarios.
   * 
   * @param {NavigationService} navigationService - Servicio de navegación.
   * @param {Object} platformId - Identificador de la plataforma.
   * @param {UsersService} usersService - Servicio de usuarios.
   * @param {OrdersService} ordersService - Servicio de órdenes.
   * @param {Router} router - Servicio de enrutamiento.
   */
  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private usersService: UsersService,
    private router: Router,
    private ordersService: OrdersService,
    private fb: FormBuilder
  ) {
    this.statusForm = this.fb.group({
      status: ['', Validators.required]
    });
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
   * Hook de inicialización del componente. Verifica el estado de inicio de sesión y carga el carrito.
   * 
   * @return {void}
   */
  ngOnInit(): void {
    this.checkLoginState();
    this.orders = this.ordersService.getOrders();
  }

  /**
   * @description
   * Verifica el estado de inicio de sesión del cliente y actualiza la interfaz de usuario en consecuencia.
   * 
   * @return {void}
   */
  checkLoginState(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.usersService.checkLoginState()) {
        // Redirigir al administrador
        //this.router.navigate(['/admin-user-management']);
        console.log('Usuario logueado.');
      } else {
        // Redirigir al administrador
        this.router.navigate(['/admin-login']);
        console.log('Usuario no logueado.');
      }
    }
  }

  /**
   * @description 
   * Muestra los detalles de la orden seleccionada.
   * 
   * @param {number} orderId - El ID de la orden seleccionada.
   * @return {void}
   */
  showOrderDetails(orderId: number): void {
    this.selectedOrderId = orderId;
    this.ordersService.getOrderDetails(orderId).subscribe(details => {
      this.selectedOrderDetails = details;
    });
  }

  /**
   * @description Cierra los detalles de la orden.
   * @param {void}
   */
  closeOrderDetails(): void {
    this.selectedOrderId = null;
    this.selectedOrderDetails = [];
    this.statusForm.reset();
  }

  /**
   * @description 
   * Actualiza el estado de la orden seleccionada.
   * 
   * @return {void}
   */
  updateOrderStatus(): void {
    if (this.selectedOrderId && this.statusForm.valid) {
      const newStatus = this.statusForm.value.status;
      this.ordersService.updateOrderStatus(this.selectedOrderId, newStatus).subscribe(order => {
        console.log('Estado de la orden actualizado:', order);
        this.orders = this.orders.map(o => o.id === order.id ? order : o);
      });
    }
  }
}