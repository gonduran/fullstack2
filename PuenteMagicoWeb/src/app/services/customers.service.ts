import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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

  private storageKey = 'customers';
  private customers: Customer[] = [];

  /**
   * @description 
   * Constructor del servicio. Carga los clientes desde localStorage.
   * 
   * @param {CryptoService} cryptoService - Servicio de encriptación.
   */
  constructor(private http: HttpClient,
              private cryptoService: CryptoService) {

  }

  MetodoCliente(listaClientes:Customer[]) {
    console.log('listaClientes', listaClientes);
    this.http.post(this.jsonUrl,listaClientes,this.httpOptions).subscribe(
      response => {
        console.log('Archivo JSON sobrescrito con exito', response);
      },
      error => {
        console.error('Error al sobrescribir el archivo JSON', error);
      })
  }

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.jsonUrl);
  }
  /*getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching customers:', error);
        return throwError(error);
      })
    );
  }*/

  validateEmail(email: string): Observable<boolean> {
    return this.getCustomers().pipe(
      map(customers => customers.some(customer => customer.email === email))
    );
  }

  validateLogin(email: string, password: string): Observable<boolean> {
    return this.getCustomers().pipe(
      map((customers: any[]) => {
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
   * Actualiza un cliente existente.
   * 
   * @param {string} clientName - Nombre del cliente.
   * @param {string} clientSurname - Apellido del cliente.
   * @param {string} email - Correo electrónico del cliente.
   * @param {string} password - Contraseña del cliente.
   * @param {string} birthdate - Fecha de nacimiento del cliente.
   * @param {string} dispatchAddress - Dirección de envío del cliente.
   * @return {boolean} - Retorna true si el cliente fue actualizado exitosamente, de lo contrario false.
   */
  updateCustomer(clientName: string, clientSurname: string, email: string, password: string, birthdate: string, dispatchAddress: string): boolean {
    console.log('Intentando actualizar cliente:', { clientName, clientSurname, email, birthdate, dispatchAddress });
    const customerExisting = this.customers.find(customer => customer.email === email);
    const id = 0;
    if (customerExisting) {
      const loggedInClient = JSON.parse(localStorage.getItem('loggedInClient') || 'null');
      const clientIndex = this.customers.findIndex(customer => customer.email === loggedInClient.email);
      if (clientIndex !== -1) {
        if (password === '') {
          console.log('Cliente no cambia su contraseña');
          const passwordSC = loggedInClient.password;
          this.customers[clientIndex] = { id, clientName: clientName, clientSurname: clientSurname, email: email, password: passwordSC, birthdate: birthdate, dispatchAddress: dispatchAddress };
        } else {
          console.log('Cliente cambia su contraseña');
          password = this.cryptoService.encrypt(password);
          this.customers[clientIndex] = { id, clientName: clientName, clientSurname: clientSurname, email: email, password: password, birthdate: birthdate, dispatchAddress: dispatchAddress };
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
   * 
   */
  logout(): void {
    if (this.isLocalStorageAvailable()) {
      console.log('Logout cliente.');
      localStorage.removeItem('loggedInClient');
    }
  }

}
