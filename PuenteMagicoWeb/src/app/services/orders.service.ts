import { Injectable } from '@angular/core';

interface Cart {
  product: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

interface Order {
  email: string;
  id: number;
  total: number;
  fecha: Date;
  estado: string;
}

interface OrderDetail {
  id: number;
  product: string;
  image: string;
  price: number;
  quantity: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private carts: Cart[] = [];
  private orders: Order[] = [];
  private orderdetails: OrderDetail[] = [];

  constructor() {
    if (this.isLocalStorageAvailable()) {
      const cartsSaved = localStorage.getItem('carts');
      this.carts = cartsSaved ? JSON.parse(cartsSaved) : [];
      const ordersSaved = localStorage.getItem('orders');
      this.orders = ordersSaved ? JSON.parse(ordersSaved) : [];
      const orderdetailsSaved = localStorage.getItem('orderdetails');
      this.orderdetails = orderdetailsSaved ? JSON.parse(orderdetailsSaved) : [];
    } else {
      this.carts = [];
      this.orders = [];
      this.orderdetails = [];
    }
  }

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

  registerOrders(email: string, total: number): boolean {
    console.log('Intentando registrar contacto cliente:', { email, total });
    const fecha = new Date();
    const estado = 'Ingresada';
    const id = this.orders.length + 1;

    const newOrder: Order = { email, id, total, fecha, estado };
    this.orders.push(newOrder);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('contacts', JSON.stringify(this.orders));
    }
    this.mostrarAlerta('Orden cliente registrado exitosamente.', 'success');
    console.log('Orden cliente registrado exitosamente:', newOrder);
    return true;
  }

  registerOrderdetails(id : number, product: string, image: string, price: number, quantity: number, total: number): boolean {
    console.log('Intentando registrar detalle compra:', { id, product, image, price, quantity, total });

    const newOrderDetail: OrderDetail = { id, product, image, price, quantity, total };
    this.orderdetails.push(newOrderDetail);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('orderdetails', JSON.stringify(this.orderdetails));
    }
    //this.mostrarAlerta('Detalle compra registrado exitosamente.', 'success');
    console.log('Detalle compra registrado exitosamente:', newOrderDetail);
    return true;
  }

  updateOrders(email: string, id: number): boolean {
    console.log('Intentando actualizar orden cliente:', { email, id });
    const orderExisting = this.orders.find(contact => contact.id === id);
    const fecha = new Date();
    const estado = 'Resuelto';
    if (orderExisting) {
      const contactIndex = this.orders.findIndex(contact => contact.id === id);
      if (contactIndex !== -1) {
        console.log('Se actualiza estado contacto cliente');
        this.orders[contactIndex] = { name: name, email: email, phone: phone, subject: subject, message: message, fecha: fecha, estado : estado, id : id };
        localStorage.setItem('orders', JSON.stringify(this.orders));

        this.mostrarAlerta('Contacto cliente actualizado exitosamente.', 'success');
        console.log('Contacto cliente actualizado exitosamente:', this.orders[contactIndex]);
        return true;
      } else {
          this.mostrarAlerta('Error al actualizar el contacto cliente.', 'danger');
          console.log('Error al actualizar el contacto cliente:', email);
          return false;
      } 
    }

    this.mostrarAlerta('Contacto cliente no actualizado.', 'danger');
    console.log('Contacto cliente no actualizado:', email);
    return false;
  }

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

  findContact(id: number): boolean {
    console.log('Buscando contacto cliente:', { id });
    const contact = this.contacts.find(contact => contact.id === id);
    if (contact) {
      this.mostrarAlerta('Contacto cliente encontrado.', 'success');
      console.log('Contacto cliente encontrado:', contact);
      return true;
    } else {
      this.mostrarAlerta('Contacto cliente no encontrado.', 'danger');
      console.log('Contacto cliente no encontrado.');
      return false;
    }
  }

  private formatToFormDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

  private formatToStorageDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }
}
