import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersService } from '../../services/orders.service';

interface Order {
  email: string;
  id: number;
  total: number;
  fecha: Date;
  estado: string;
}

interface Orderdetail {
  id: number;
  product: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

@Component({
  selector: 'app-admin-order-monitoring',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './admin-order-monitoring.component.html',
  styleUrl: './admin-order-monitoring.component.scss'
})
export class AdminOrderMonitoringComponent implements OnInit, AfterViewInit {
  orders: Order[] = [];
  selectedOrderDetails: Orderdetail[] = [];
  selectedOrderId: number | null = null;
  editOrderForm: FormGroup;
  
  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private usersService: UsersService,
    private router: Router,
    private orderService: OrdersService,
    private fb: FormBuilder
  ) {
    this.editOrderForm = this.fb.group({
      clientName: ['', Validators.required],
      productName: ['', Validators.required],
      quantity: ['', Validators.required],
      status: ['', Validators.required]
    });
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

  ngOnInit(): void {
    this.checkLoginState();
	this.orders = this.orderService.getOrders();
  }

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

  selectOrder(orderId: number): void {
    this.selectedOrderId = orderId;
    this.selectedOrderDetails = this.orderService.getOrderDetails(orderId);
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      this.editOrderForm.patchValue({
        clientName: order.email,
        productName: this.selectedOrderDetails.map(detail => detail.product).join(', '),
        quantity: this.selectedOrderDetails.reduce((acc, detail) => acc + detail.quantity, 0),
        status: order.estado
      });
    }
  }

  getOrderProducts(orderId: number): string {
    const products = this.orderService.getOrderDetails(orderId).map(detail => detail.product);
    return products.join(', ');
  }

  getOrderQuantity(orderId: number): number {
    const quantity = this.orderService.getOrderDetails(orderId).reduce((acc, detail) => acc + detail.quantity, 0);
    return quantity;
  }

  updateOrderStatus(): void {
    if (this.selectedOrderId !== null) {
      const newStatus = this.editOrderForm.value.status;
      this.orderService.updateOrderStatus(this.selectedOrderId, newStatus);
      this.orders = this.orderService.getOrders();
    }
  }
}