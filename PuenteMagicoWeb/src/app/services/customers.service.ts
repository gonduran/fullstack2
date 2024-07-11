import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * @description 
 * Interface de Clientes.
 * 
 */
export interface Customer {
  id: number;
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
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 54d1a9fa-d9cc-455c-8c64-a898aa7eb3a4'
    })
  }

  private jsonUrl = 'https://firebasestorage.googleapis.com/v0/b/puentemagicojson.appspot.com/o/customers.json?alt=media&token=54d1a9fa-d9cc-455c-8c64-a898aa7eb3a4'; 

  /**
   * @description 
   * Constructor del servicio. Inicializa el servicio HTTP y el servicio de encriptación.
   * 
   * @param {HttpClient} http - Servicio HTTP para realizar solicitudes.
   * @param {CryptoService} cryptoService - Servicio de encriptación.
   */
  constructor(private http: HttpClient, private cryptoService: CryptoService) {}

  /**
   * @description 
   * Sobrescribe el archivo JSON con la lista de clientes proporcionada.
   * 
   * @param {Customer[]} listaClientes - La lista de clientes a sobrescribir en el archivo JSON.
   */
  MetodoCliente(listaClientes: Customer[]): void {
    console.log('listaClientes', listaClientes);
    this.http.post(this.jsonUrl, listaClientes, this.httpOptions).subscribe(
      response => {
        console.log('MetodoCliente: Archivo JSON sobrescrito con éxito', response);
      },
      error => {
        console.error('MetodoCliente: Error al sobrescribir el archivo JSON', error);
      }
    );
  }

  /**
   * @description 
   * Obtiene la lista de clientes desde el archivo JSON.
   * 
   * @return {Observable<Customer[]>} - Un observable con la lista de clientes.
   */
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.jsonUrl).pipe(
      catchError(error => {
        console.error('Error al recuperar clientes:', error);
        return throwError(error);
      })
    );
  }

  /**
   * @description 
   * Valida si un correo electrónico ya está registrado.
   * 
   * @param {string} email - El correo electrónico a validar.
   * @return {Observable<boolean>} - Un observable que retorna true si el correo electrónico ya está registrado, de lo contrario false.
   */
  validateEmail(email: string): Observable<boolean> {
    return this.getCustomers().pipe(
      map(customers => customers.some(customer => customer.email === email))
    );
  }

  /**
   * @description 
   * Valida las credenciales de inicio de sesión del cliente.
   * 
   * @param {string} email - El correo electrónico del cliente.
   * @param {string} password - La contraseña del cliente.
   * @return {Observable<boolean>} - Un observable que retorna true si las credenciales son válidas, de lo contrario false.
   */
  validateLogin(email: string, password: string): Observable<boolean> {
    return this.getCustomers().pipe(
      map((customers: Customer[]) => {
        const customer = customers.find(c => c.email === email && this.cryptoService.decrypt(c.password) === password);
        if (customer) {
          this.setLoginState(customer);
        }
        return !!customer;
      })
    );
  }

  /**
   * @description 
   * Obtiene un cliente por su correo electrónico.
   * 
   * @param {string} email - El correo electrónico del cliente.
   * @return {Observable<Customer | undefined>} - Un observable que retorna el cliente si es encontrado, de lo contrario undefined.
   */
  getCustomerByEmail(email: string): Observable<Customer | undefined> {
    return this.getCustomers().pipe(
      map(customers => customers.find(customer => customer.email === email))
    );
  }

  /**
   * @description 
   * Actualiza la información de un cliente existente.
   * 
   * @param {Customer} updatedCustomer - Los datos actualizados del cliente.
   * @return {Observable<Customer[]>} - Un observable con la lista de clientes actualizada.
   */
  updateCustomer(updatedCustomer: Customer): Observable<Customer[]> {
    return this.getCustomers().pipe(
      map(customers => {
        const index = customers.findIndex(customer => customer.id === updatedCustomer.id);
        if (index !== -1) {
          customers[index] = updatedCustomer;
          this.MetodoCliente(customers);
        }
        return customers;
      })
    );
  }

  /**
   * @description 
   * Agrega un nuevo cliente a la lista.
   * 
   * @param {Customer} newCustomer - Los datos del nuevo cliente.
   * @return {Observable<Customer[]>} - Un observable con la lista de clientes actualizada.
   */
  addCustomer(newCustomer: Customer): Observable<Customer[]> {
    return this.getCustomers().pipe(
      map(customers => {
        const customerExists = customers.some(customer => customer.email === newCustomer.email);
        if (customerExists) {
          throw new Error('El cliente ya existe.');
        }
        newCustomer.id = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
        customers.push(newCustomer);
        this.MetodoCliente(customers);
        return customers;
      }),
      catchError(error => {
        console.error('Error al agregar cliente:', error);
        return throwError(error);
      })
    );
  }

  /**
   * @description 
   * Muestra una alerta en la interfaz de usuario.
   * 
   * @param {string} mensaje - El mensaje de la alerta.
   * @param {string} tipo - El tipo de alerta (e.g., 'success', 'danger').
   */
  mostrarAlerta(mensaje: string, tipo: string): void {
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

  /**
   * @description 
   * Establece el estado de inicio de sesión del cliente.
   * 
   * @param {Customer} customer - El cliente que ha iniciado sesión.
   */
  setLoginState(customer: Customer): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('loggedInClient', JSON.stringify(customer));
    }
  }

  /**
   * @description 
   * Verifica el estado de inicio de sesión del cliente.
   * 
   * @return {boolean} - Retorna true si el cliente ha iniciado sesión, de lo contrario false.
   */
  checkLoginState(): boolean {
    if (this.isLocalStorageAvailable()) {
      const loggedInClient = JSON.parse(localStorage.getItem('loggedInClient') || 'null');
      return loggedInClient !== null;
    }
    return false;
  }

  /**
   * @description 
   * Obtiene el correo electrónico del cliente logueado.
   * 
   * @return {string} - Retorna el correo electrónico del cliente logueado.
   */
  getLoggedInClientEmail(): string {
    if (this.isLocalStorageAvailable()) {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInClient') || '');
      return loggedInUser ? loggedInUser.email : '';
    }
    return '';
  }

  /**
   * @description 
   * Cierra la sesión del cliente.
   */
  logout(): void {
    if (this.isLocalStorageAvailable()) {
      console.log('Logout cliente.');
      localStorage.removeItem('loggedInClient');
    }
  }
}