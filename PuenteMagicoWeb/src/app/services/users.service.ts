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

  iniciarSesion(email: string, password: string): boolean {
    console.log('Intentando iniciar sesión:', { email, password });
    const user = this.users.find(user => user.email === email && user.password === password);
    //const user = this.users.find(user => user.email === email && this.cryptoService.decrypt(user.password) === password);
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

  setLoginState(user: any): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
    }
  }

  checkLoginState(): boolean {
    if (this.isLocalStorageAvailable()) {
      const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || 'null');
      return loggedInUser !== null;
    }
    return false;
  }

  logout(): void {
    if (this.isLocalStorageAvailable()) {
      console.log('Logout usuario.');
      localStorage.removeItem('loggedInUser');
    }
  }

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

  private storageKey = 'users';

  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
  }

  addUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  updateUser(index: number, updatedUser: User): void {
    const users = this.getUsers();
    users[index] = updatedUser;
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }

  deleteUser(index: number): void {
    const users = this.getUsers();
    users.splice(index, 1);
    localStorage.setItem(this.storageKey, JSON.stringify(users));
  }
}
