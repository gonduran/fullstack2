import { Injectable } from '@angular/core';
import { CryptoService } from './crypto.service';

interface Users {
  name: string;
  email: string;
  password: string;
  profile: string;
}

interface Profile {
  id: number;
  name: string;
}

interface User {
  name: string;
  email: string;
  password: string;
  profile: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: Users[] = [];
  private profiles: Profile[] = [];
  private storageKey = 'users';

  /**
   * @description 
   * Constructor del servicio. Carga los perfiles y usuarios desde localStorage.
   * 
   * @param {CryptoService} cryptoService - Servicio para encriptar y desencriptar datos.
   */
  constructor(private cryptoService: CryptoService) {
    if (this.isLocalStorageAvailable()) {
      const profilesSaved = localStorage.getItem('profiles');
      this.profiles = profilesSaved ? JSON.parse(profilesSaved) : [];
      const usersSaved = localStorage.getItem('users');
      this.users = usersSaved ? JSON.parse(usersSaved) : [];
    } else {
      this.users = [];
      this.profiles = [];
    }
  }

  /**
   * @description 
   * Registra un nuevo perfil de usuario.
   * 
   * @param {number} id - El ID del perfil.
   * @param {string} name - El nombre del perfil.
   * @return {boolean} - Retorna true si el perfil fue registrado exitosamente, de lo contrario false.
   */
  registerProfile(id: number, name: string): boolean {
    console.log('Intentando registrar perfil de usuario:', { id, name });
    const profileExisting = this.profiles.find(profile => profile.id === id);
    if (profileExisting) {
      this.mostrarAlerta('El perfil de usuario ya existe.', 'danger');
      console.log('El perfil de usuario ya existe.');
      return false;
    }

    const newProfile: Profile = { id, name };
    this.profiles.push(newProfile);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('profiles', JSON.stringify(this.profiles));
    }
    this.mostrarAlerta('Perfil de usuario registrado exitosamente.', 'success');
    console.log('Perfil de usuario registrado exitosamente:', newProfile);
    return true;
  }

  /**
   * @description 
   * Registra un nuevo usuario.
   * 
   * @param {string} name - El nombre del usuario.
   * @param {string} email - El correo electrónico del usuario.
   * @param {string} password - La contraseña del usuario.
   * @param {string} profile - El perfil del usuario.
   * @return {boolean} - Retorna true si el usuario fue registrado exitosamente, de lo contrario false.
   */
  registerUser(name: string, email: string, password: string, profile: string): boolean {
    console.log('Intentando registrar usuario:', { name, email, profile });
    const userExisting = this.users.find(user => user.email === email);
    if (userExisting) {
      this.mostrarAlerta('El usuario ya existe.', 'danger');
      console.log('El usuario ya existe.');
      return false;
    }

    const newUser: Users = { name, email, password, profile };
    this.users.push(newUser);
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('users', JSON.stringify(this.users));
    }
    this.mostrarAlerta('Usuario registrado exitosamente.', 'success');
    console.log('Usuario registrado exitosamente:', newUser);
    return true;
  }

  /**
   * @description 
   * Actualiza un usuario existente.
   * 
   * @param {string} name - El nombre del usuario.
   * @param {string} email - El correo electrónico del usuario.
   * @param {string} password - La contraseña del usuario.
   * @param {string} profile - El perfil del usuario.
   * @return {boolean} - Retorna true si el usuario fue actualizado exitosamente, de lo contrario false.
   */
  updatedUser(name: string, email: string, password: string, profile: string): boolean {
    console.log('Intentando actualizar usuario:', { name, email, password, profile });
    const userExisting = this.users.find(user => user.email === email);
    if (userExisting) {
      const userIndex = this.users.findIndex(user => user.email === email);
      if (userIndex !== -1) {
        password = this.cryptoService.encrypt(password);
        this.users[userIndex] = { name: name, email: email, password: password, profile: profile };
        localStorage.setItem('users', JSON.stringify(this.users));

        this.mostrarAlerta('Usuario actualizado exitosamente.', 'success');
        console.log('Usuario actualizado exitosamente:', this.users[userIndex]);
        return true;
      } else {
        this.mostrarAlerta('Error al actualizar el usuario.', 'danger');
        console.log('Error al actualizar el usuario:', email);
        return false;
      }
    }

    this.mostrarAlerta('Usuario no actualizado.', 'danger');
    console.log('Usuario no actualizado:', email);
    return false;
  }

  /**
   * @description 
   * Inicia sesión de un usuario.
   * 
   * @param {string} email - El correo electrónico del usuario.
   * @param {string} password - La contraseña del usuario.
   * @return {boolean} - Retorna true si el inicio de sesión fue exitoso, de lo contrario false.
   */
  iniciarSesion(email: string, password: string): boolean {
    console.log('Intentando iniciar sesión:', { email, password });
    // const user = this.users.find(user => user.email === email && this.cryptoService.decrypt(user.password) === password);
    const user = this.users.find(user => user.email.trim() === email.trim() && user.password.trim() === password.trim());
    console.log('Estado sesión:', user);
    if (user) {
      this.mostrarAlerta('Inicio de sesión exitoso.', 'success');
      console.log('Inicio de sesión exitoso:', user);
      this.setLoginState(user);
      return true;
    } else {
      this.mostrarAlerta('Email o contraseña incorrectos.', 'danger');
      console.log('Email o contraseña incorrectos.');
      return false;
    }
  }

  /**
   * @description 
   * Muestra una alerta en la interfaz de usuario.
   * 
   * @param {string} mensaje - El mensaje de la alerta.
   * @param {string} tipo - El tipo de alerta (e.g., 'success', 'danger').
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

  /**
   * @description 
   * Busca un usuario por su correo electrónico.
   * 
   * @param {string} email - El correo electrónico del usuario.
   * @return {boolean} - Retorna true si el usuario fue encontrado, de lo contrario false.
   */
  findUser(email: string): boolean {
    console.log('Buscando usuario:', { email });
    const user = this.users.find(user => user.email === email);
    if (user) {
      this.mostrarAlerta('Usuario encontrado.', 'success');
      console.log('Usuario encontrado:', user);
      return true;
    } else {
      this.mostrarAlerta('Usuario no encontrado.', 'danger');
      console.log('Usuario no encontrado.');
      return false;
    }
  }

  /**
   * @description 
   * Obtiene la lista de todos los usuarios.
   * 
   * @return {User[]} - Un array de objetos User.
   */
  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  /**
   * @description 
   * Agrega un nuevo usuario a la lista y guarda en localStorage.
   * 
   * @param {User} user - El usuario a agregar.
   * @return {void}
   */
  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  /**
   * @description 
   * Actualiza un usuario existente.
   * 
   * @param {number} index - El índice del usuario a actualizar.
   * @param {User} updatedUser - Los datos actualizados del usuario.
   * @return {void}
   */
  updateUser(index: number, updatedUser: User): void {
    const users = this.getUsers();
    users[index] = updatedUser;
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  /**
   * @description 
   * Elimina un usuario de la lista y de localStorage.
   * 
   * @param {number} index - El índice del usuario a eliminar.
   * @return {void}
   */
  deleteUser(index: number): void {
    const users = this.getUsers();
    users.splice(index, 1);
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }
}
