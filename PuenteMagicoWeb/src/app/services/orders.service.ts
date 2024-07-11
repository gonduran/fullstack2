import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * @description 
 * Interface de Carro de Compra.
 */
export interface Cart {
  product: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

/**
 * @description 
 * Interface de Ordenes de Compra.
 */
export interface Order {
  email: string;
  id: number;
  total: number;
  fecha: string;
  estado: string;
}

/**
 * @description 
 * Interface de Detalle de Ordenes de Compra.
 */
export interface OrderDetail extends Cart {
  orderId: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 3325d02c-9baf-4d8e-9747-250f21a63494'
    })
  }

  private jsonUrl = 'https://firebasestorage.googleapis.com/v0/b/puentemagicojson.appspot.com/o/orders.json?alt=media&token=3325d02c-9baf-4d8e-9747-250f21a63494'; 
  private carts: Cart[] = [];
  private orders: Order[] = [];
  private orderdetails: OrderDetail[] = [];

  /**
   * @description 
   * Constructor del servicio. Inicializa el servicio HTTP.
   * 
   * @param {HttpClient} http - Servicio HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) {
    this.loadOrdersFromJson();
    if (this.isLocalStorageAvailable()) {
      const cartsSaved = localStorage.getItem('carts');
      this.carts = cartsSaved ? JSON.parse(cartsSaved) : [];
    } else {
      this.carts = [];
    }
    console.log('constructor this.orders:', this.orders);
    console.log('constructor this.orderdetails:', this.orderdetails);
  }

  /**
   * @description 
   * Carga las órdenes y los detalles de las órdenes desde el archivo JSON.
   * 
   * @return {void}
   */
  private loadOrdersFromJson(): void {
    this.http.get<any>(this.jsonUrl).subscribe(data => {
      this.orders = data.orders || [];
      this.orderdetails = data.orderdetails || [];
    }, error => {
      console.error('Error al cargar las órdenes:', error);
    });
  }

  /**
   * @description 
   * Registra una nueva orden.
   * 
   * @param {string} email - El correo electrónico del cliente.
   * @param {number} total - El total de la orden.
   * @return {number} - Retorna el ID de la nueva orden registrada.
   */
  registerOrder(email: string, total: number): number {
    const fechaNow = new Date();
    const year = fechaNow.getFullYear();
    const month = String(fechaNow.getMonth() + 1).padStart(2, '0');
    const day = String(fechaNow.getDate()).padStart(2, '0');

    const fecha = `${year}-${month}-${day}`;

    const estado = 'Pendiente';
    const id = this.orders.length + 1;

    const newOrder: Order = { email, id, total, fecha, estado };
    this.orders.push(newOrder);
    console.log('registerOrder this.carts:', this.carts);

    const newOrderDetails: OrderDetail[] = this.carts.map(cart => ({
      ...cart,
      orderId: id
    }));
    this.orderdetails.push(...newOrderDetails);

    console.log('registerOrder this.orders:', this.orders);
    console.log('registerOrder this.orderdetails:', this.orderdetails);

    const data = {
      orders: this.orders,
      orderdetails: this.orderdetails
    };
    console.log('registerOrder data:', data);

    this.http.post(this.jsonUrl, data, this.httpOptions).subscribe(
      response => {
        console.log('registerOrder: Archivo JSON sobrescrito con éxito', response);
      },
      error => {
        console.error('registerOrder: Error al sobrescribir el archivo JSON', error);
      }
    );
    console.log('registerOrder se ejecuto this.saveOrders:');
    this.clearCart();
    return id;
  }

  /**
   * @description 
   * Actualiza el estado de una orden.
   * 
   * @param {number} orderId - El ID de la orden.
   * @param {string} status - El nuevo estado de la orden.
   * @return {Observable<Order>} - Retorna un observable con la orden actualizada.
   */
  updateOrderStatus(orderId: number, status: string): Observable<Order> {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.estado = status;
      const data = {
        orders: this.orders,
        orderdetails: this.orderdetails
      };
      return this.http.post(this.jsonUrl, data, this.httpOptions).pipe(
        map(() => order),
        catchError(error => {
          console.error('Error al actualizar el estado de la orden:', error);
          return throwError(error);
        })
      );
    }
    return throwError('Order not found');
  }

  /**
   * @description 
   * Obtiene todas las órdenes.
   * 
   * @return {Order[]} - Lista de órdenes.
   */
  getOrders(): Order[] {
    return this.orders;
  }

  /**
   * @description 
   * Obtiene los detalles de una orden específica.
   * 
   * @param {number} orderId - El ID de la orden.
   * @return {Observable<OrderDetail[]>} - Retorna un observable con los detalles de la orden.
   */
  getOrderDetails(orderId: number): Observable<OrderDetail[]> {
    const details = this.orderdetails.filter(detail => detail.orderId === orderId);
    return of(details);
  }

  /**
   * @description 
   * Muestra una alerta en la interfaz de usuario.
   * 
   * @param {string} mensaje - El mensaje de la alerta.
   * @param {string} tipo - El tipo de alerta (e.g., 'success', 'danger').
   * @return {void}
   */
  private mostrarAlerta(mensaje: string, tipo: string): void {
    const alertaDiv = document.createElement('div');
    alertaDiv.className = `alert alert-${tipo}`;
    alertaDiv.appendChild(document.createTextNode(mensaje));
    const container = document.querySelector('.container');
    if (container) {
      const firstChild = container.firstChild;
      if (firstChild) {
        container.insertBefore(alertaDiv, firstChild);
      } else {
        container.appendChild(alertaDiv);
      }

      setTimeout(() => {
        const alerta = document.querySelector('.alert');
        if (alerta) {
          alerta.remove();
        }
      }, 6000);
    }
  }

  /**
   * @description 
   * Verifica si localStorage está disponible.
   * 
   * @return {boolean} - Retorna true si localStorage está disponible, de lo contrario false.
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * @description 
   * Registra un nuevo producto en el carro de compra.
   * 
   * @param {string} product - El nombre del producto.
   * @param {string} image - La URL de la imagen del producto.
   * @param {number} price - El precio del producto.
   * @param {number} quantity - La cantidad del producto.
   * @param {number} total - El total del producto.
   * @return {boolean} - Retorna true si el producto fue registrado exitosamente en el carro, de lo contrario false.
   */
  registerCarts(product: string, image: string, price: number, quantity: number, total: number): boolean {
    console.log('Intentando registrar producto en carro compra:', { product, image, price, quantity, total });

    const newCart: Cart = { product, image, price, quantity, total };
    this.carts.push(newCart);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('carts', JSON.stringify(this.carts));
    }
    this.mostrarAlerta('Producto registrado exitosamente en carro compra.', 'success');
    console.log('Producto registrado exitosamente en carro compra:', newCart);
    return true;
  }

  /**
   * @description 
   * Limpia el carro de compra.
   * 
   * @return {void}
   */
  clearCart(): void {
    this.carts = [];
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('carts');
    }
  }

  /**
   * @description 
   * Elimina un producto del carro de compra.
   * 
   * @param {number} index - El índice del producto a eliminar.
   * @return {void}
   */
  removeFromCart(index: number): void {
    this.carts.splice(index, 1);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('carts', JSON.stringify(this.carts));
    }
  }

  /**
   * @description 
   * Formatea una fecha en formato YYYY-MM-DD a DD-MM-YYYY.
   * 
   * @param {string} date - La fecha en formato YYYY-MM-DD.
   * @return {string} - La fecha formateada en formato DD-MM-YYYY.
   */
  private formatToFormDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

  /**
   * @description 
   * Formatea una fecha en formato DD-MM-YYYY a YYYY-MM-DD.
   * 
   * @param {string} date - La fecha en formato DD-MM-YYYY.
   * @return {string} - La fecha formateada en formato YYYY-MM-DD.
   */
  private formatToStorageDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }
}
