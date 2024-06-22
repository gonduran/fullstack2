import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';

interface Customer {
  clientName: string;
  clientSurname: string;
  email: string;
  password: string;
  birthdate: string;
  dispatchAddress: string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private customers: Customer[] = [];

  constructor(private cryptoService: CryptoService) {
    if (this.isLocalStorageAvailable()) {
      const customersSaved = localStorage.getItem('customers');
      this.customers = customersSaved ? JSON.parse(customersSaved) : [];
    } else {
      this.customers = [];
    }
  }

  registerCustomer(clientName: string, clientSurname: string, email: string, password: string, birthdate: string, dispatchAddress: string): boolean {
    console.log('Intentando registrar cliente:', { clientName, clientSurname, email, birthdate, dispatchAddress });
    const customerExisting = this.customers.find(customer => customer.email === email);
    if (customerExisting) {
      this.mostrarAlerta('El cliente ya existe.', 'danger');
      console.log('El cliente ya existe.');
      return false;
    }

    const newCustomer: Customer = { clientName, clientSurname, email, password, birthdate, dispatchAddress };
    this.customers.push(newCustomer);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('customers', JSON.stringify(this.customers));
    }
    this.mostrarAlerta('Cliente registrado exitosamente.', 'success');
    console.log('Cliente registrado exitosamente:', newCustomer);
    return true;
  }

  updateCustomer(clientName: string, clientSurname: string, email: string, password: string, birthdate: string, dispatchAddress: string): boolean {
    console.log('Intentando actualizar cliente:', { clientName, clientSurname, email, birthdate, dispatchAddress });
    const customerExisting = this.customers.find(customer => customer.email === email);
    if (customerExisting) {
      const loggedInClient = JSON.parse(localStorage.getItem('loggedInClient') || 'null');
      const clientIndex = this.customers.findIndex(customer => customer.clientName === loggedInClient.clientName && customer.email === loggedInClient.email);
      if (clientIndex !== -1) {
          if (password === '') {
              console.log('Cliente no cambia su contraseña');
              const passwordSC = loggedInClient.password;
              this.customers[clientIndex] = { clientName: clientName, clientSurname: clientSurname, email: email, password: passwordSC, birthdate: birthdate, dispatchAddress: dispatchAddress };
          }
          else {
              console.log('Cliente cambia su contraseña');
              password = this.cryptoService.encrypt(password);
              this.customers[clientIndex] = { clientName: clientName, clientSurname: clientSurname, email: email, password: password, birthdate: birthdate, dispatchAddress: dispatchAddress };
          }
          localStorage.setItem('customers', JSON.stringify(this.customers));
  
          // Actualizar los datos del cliente logueado en localStorage
          localStorage.setItem('loggedInClient', JSON.stringify(this.customers[clientIndex]));
  
          this.mostrarAlerta('Cliente actualizado exitosamente.', 'success');
          console.log('Cliente actualizado exitosamente:', this.customers[clientIndex]);
          return true;
      } else {
          this.mostrarAlerta('Error al actualizar el perfil cliente.', 'danger');
          console.log('Error al actualizar el perfil cliente:', email);
          return false;
      } 
    }

    this.mostrarAlerta('Cliente no actualizado.', 'danger');
    console.log('Cliente no actualizado:', email);
    return false;
  }

  iniciarSesion(email: string, password: string): boolean {
    console.log('Intentando iniciar sesión:', { email, password });
    const customer = this.customers.find(customer => customer.email === email && this.cryptoService.decrypt(customer.password) === password);
    if (customer) {
      this.mostrarAlerta('Inicio de sesión exitoso.', 'success');
      console.log('Inicio de sesión exitoso:', customer);
      this.setLoginState(customer);
      return true;
    } else {
      this.mostrarAlerta('Email o contraseña incorrectos.', 'danger');
      console.log('Email o contraseña incorrectos.');
      return false;
    }
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

  isLocalStorageAvailable(): boolean {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  setLoginState(customer: any): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('loggedInClient', JSON.stringify(customer));
    }
  }

  checkLoginState(): boolean {
    if (this.isLocalStorageAvailable()) {
      const loggedInClient = JSON.parse(localStorage.getItem('loggedInClient') || 'null');
      return loggedInClient !== null;
    }
    return false;
  }

  logout(): void {
    if (this.isLocalStorageAvailable()) {
      console.log('Logout cliente.');
      localStorage.removeItem('loggedInClient');
    }
  }

  findCustomer(email: string): boolean {
    console.log('Buscando cliente:', { email });
    const customer = this.customers.find(customer => customer.email === email);
    if (customer) {
      this.mostrarAlerta('Cliente encontrado.', 'success');
      console.log('Cliente encontrado:', customer);
      return true;
    } else {
      this.mostrarAlerta('Cliente no encontrado.', 'danger');
      console.log('Cliente no encontrado.');
      return false;
    }
  }
}
