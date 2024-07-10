import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

/**
 * @description 
 * Interface de Usuarios.
 * 
 */
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  profile: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 91e7d0c0-fde6-436b-a798-35b8bbabcc84'
    })
  }

  private jsonUrl = 'https://firebasestorage.googleapis.com/v0/b/puentemagicojson.appspot.com/o/users.json?alt=media&token=91e7d0c0-fde6-436b-a798-35b8bbabcc84'; 

  private users: User[] = [];

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
   * Sobrescribe el archivo JSON con la lista de usuarios proporcionada.
   * 
   * @param {User[]} listaUsuarios - La lista de usuarios a sobrescribir en el archivo JSON.
   */
  MetodoUsuario(listaUsuarios: User[]): void {
    console.log('listaUsuarios', listaUsuarios);
    this.http.post(this.jsonUrl, listaUsuarios, this.httpOptions).subscribe(
      response => {
        console.log('MetodoUsuario: Archivo JSON sobrescrito con éxito', response);
      },
      error => {
        console.error('MetodoUsuario: Error al sobrescribir el archivo JSON', error);
      }
    );
  }

  /**
   * @description 
   * Obtiene la lista de usuarios desde el archivo JSON.
   * 
   * @return {Observable<User[]>} - Un observable con la lista de usuarios.
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.jsonUrl).pipe(
      catchError(error => {
        console.error('Error al recuperar usuarios:', error);
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
    return this.getUsers().pipe(
      map(users => users.some(user => user.email === email))
    );
  }

  /**
   * @description 
   * Valida las credenciales de inicio de sesión del usuario.
   * 
   * @param {string} email - El correo electrónico del usuario.
   * @param {string} password - La contraseña del usuario.
   * @return {Observable<boolean>} - Un observable que retorna true si las credenciales son válidas, de lo contrario false.
   */
  validateLogin(email: string, password: string): Observable<boolean> {
    return this.getUsers().pipe(
      map((users: User[]) => {
        const user = users.find(c => c.email === email && this.cryptoService.decrypt(c.password) === password);
        if (user) {
          this.setLoginState(user);
        }
        return !!user;
      })
    );
  }

  /**
   * @description 
   * Obtiene un usuario por su correo electrónico.
   * 
   * @param {string} email - El correo electrónico del usuario.
   * @return {Observable<Customer | undefined>} - Un observable que retorna el usuario si es encontrado, de lo contrario undefined.
   */
  getUserByEmail(email: string): Observable<User | undefined> {
    return this.getUsers().pipe(
      map(users => users.find(user => user.email === email))
    );
  }

  /**
   * @description 
   * Actualiza la información de un usuario existente.
   * 
   * @param {User} updatedUser - Los datos actualizados del usuario.
   * @return {Observable<User[]>} - Un observable con la lista de usuarios actualizada.
   */
  updateUser(updatedUser: User): Observable<User[]> {
    return this.getUsers().pipe(
      map(users => {
        const index = users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
          users[index] = updatedUser;
          this.MetodoUsuario(users);
        }
        return users;
      })
    );
  }

  /**
   * @description 
   * Agrega un nuevo usuario a la lista.
   * 
   * @param {User} newUser - Los datos del nuevo usuario.
   * @return {Observable<User[]>} - Un observable con la lista de usuarios actualizada.
   */
  addUser(newUser: User): Observable<User[]> {
    return this.getUsers().pipe(
      map(users => {
        const userExists = users.some(user => user.email === newUser.email);
        if (userExists) {
          throw new Error('El cliente ya existe.');
        }
        newUser.id = users.length > 0 ? Math.max(...users.map(c => c.id)) + 1 : 1;
        users.push(newUser);
        this.MetodoUsuario(users);
        return users;
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
   * Establece el estado de inicio de sesión del usuario.
   * 
   * @param {any} user - El usuario que ha iniciado sesión.
   */
  setLoginState(user: any): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
    }
  }

  /**
   * @description 
   * Verifica el estado de inicio de sesión del usuario.
   * 
   * @return {boolean} - Retorna true si el usuario ha iniciado sesión, de lo contrario false.
   */
  checkLoginState(): boolean {
    if (this.isLocalStorageAvailable()) {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
      return loggedInUser !== null;
    }
    return false;
  }

  /**
   * @description Cierra la sesión del usuario.
   */
  logout(): void {
    if (this.isLocalStorageAvailable()) {
      console.log('Logout usuario.');
      localStorage.removeItem('loggedInUser');
    }
  }
}
