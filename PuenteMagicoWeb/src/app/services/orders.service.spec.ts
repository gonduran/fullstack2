import { TestBed } from '@angular/core/testing';
import { OrdersService, Cart, Order, OrderDetail } from './orders.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

/**
 * @description Pruebas unitarias para OrdersService.
 */
describe('OrdersService', () => {
  let service: OrdersService;
  let httpMock: HttpTestingController;

  /**
   * @description Configura el entorno de pruebas antes de cada prueba.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrdersService]
    });
    service = TestBed.inject(OrdersService);
    httpMock = TestBed.inject(HttpTestingController);

    // Asegúrate de simular la carga inicial del JSON
    const req = httpMock.expectOne(service['jsonUrl']);
    expect(req.request.method).toBe('GET');
    req.flush({ orders: [], orderdetails: [] });
  });

  /**
   * @description Limpia las pruebas después de cada ejecución.
   */
  afterEach(() => {
    httpMock.verify();
  });

  /**
   * @description Verifica que el servicio se haya creado correctamente.
   * @return {void}
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  /**
   * @description Verifica que registerOrder registre una nueva orden y la envíe correctamente al backend.
   * @return {void}
   */
  it('should register a new order', () => {
    const email = 'test@example.com';
    const total = 100;
    const newOrderId = service.registerOrder(email, total);

    expect(newOrderId).toBe(1);

    const req = httpMock.expectOne(service['jsonUrl']);
    expect(req.request.method).toBe('POST');
    req.flush({});
  });

  /**
   * @description Verifica que updateOrderStatus actualice el estado de la orden.
   * @return {void}
   */
  /*it('should update order status', () => {
    const email = 'test@example.com';
    const total = 100;
    service.registerOrder(email, total);
    service.updateOrderStatus(1, 'Enviado');

    const order = service.getOrders().find(o => o.id === 1);
    expect(order?.estado).toBe('Enviado');
  });*/

  /**
   * @description Verifica que getOrders retorne todas las órdenes.
   * @return {void}
   */
  it('should retrieve all orders', () => {
    const orders = service.getOrders();
    expect(orders.length).toBe(0);
  });

  /**
   * @description Verifica que getOrderDetails retorne los detalles de una orden específica.
   * @param {void}
   */
  /*it('should retrieve order details', () => {
    const email = 'test@example.com';
    const total = 100;
    service.registerOrder(email, total);

    const orderDetails = service.getOrderDetails(1);
    expect(orderDetails.length).toBe(0); // Assuming the cart is empty
  });*/

  /**
   * @description Verifica que registerCarts registre un producto en el carro de compra.
   * @return {void}
   */
  it('should register a product in cart', () => {
    const product = 'Test Product';
    const image = 'test.jpg';
    const price = 10;
    const quantity = 1;
    const total = 10;

    const result = service.registerCarts(product, image, price, quantity, total);
    expect(result).toBeTrue();
  });

  /**
   * @description Verifica que clearCart limpie el carro de compra.
   * @return {void}
   */
  it('should clear the cart', () => {
    service.clearCart();
    expect(service['carts'].length).toBe(0);
  });

  /**
   * @description Verifica que removeFromCart elimine un producto del carro de compra.
   * @return {void}
   */
  it('should remove a product from cart', () => {
    const product = 'Test Product';
    const image = 'test.jpg';
    const price = 10;
    const quantity = 1;
    const total = 10;
    service.registerCarts(product, image, price, quantity, total);

    service.removeFromCart(0);
    expect(service['carts'].length).toBe(0);
  });

  /**
   * @description Verifica que isLocalStorageAvailable retorne true si localStorage está disponible.
   * @return {void}
   */
  it('should check if localStorage is available', () => {
    const result = (service as any).isLocalStorageAvailable();
    expect(result).toBeTrue();
  });

  /**
   * @description Verifica que formatToFormDate formatee la fecha correctamente.
   * @return {void}
   */
  it('should format date to form date', () => {
    const date = '2023-12-25';
    const result = (service as any).formatToFormDate(date);
    expect(result).toBe('25-12-2023');
  });

  /**
   * @description Verifica que formatToStorageDate formatee la fecha correctamente.
   * @return {void}
   */
  it('should format date to storage date', () => {
    const date = '25-12-2023';
    const result = (service as any).formatToStorageDate(date);
    expect(result).toBe('2023-12-25');
  });
});