import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { UsersService, User } from '../../services/users.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CryptoService } from '../../services/crypto.service';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './admin-user-management.component.html',
  styleUrl: './admin-user-management.component.scss',
  providers: [UsersService]
})
export class AdminUserManagementComponent implements OnInit, AfterViewInit {

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private userService: UsersService,
    private cryptoService: CryptoService,
    private router: Router
  ) { }

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

  users: User[] = [];
  newUser: User = { id: 0, name: '', email: '', password: '', profile: '' };
  selectedUser: User = { id: 0, name: '', email: '', password: '', profile: '' };
  selectedIndex: number | null = null;

  ngOnInit(): void {
    this.loadUsers();
    this.checkLoginState();
  }

  /**
   * @description 
   * Carga la lista de usuarios desde el servicio de usuarios.
   * 
   * @return {void}
   */
  loadUsers(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  /**
  * @description 
  * Maneja la adición de un nuevo usuario. Asigna un ID único, encripta la contraseña y guarda el usuario.
  * 
  * @return {void}
  */
  onAddUser(): void {
    this.newUser.id = this.users.length > 0 ? Math.max(...this.users.map((p: any) => p.id)) + 1 : 1;
    this.newUser.password = this.cryptoService.encrypt(this.newUser.password);
    this.userService.addUser(this.newUser);
    this.users.push(this.newUser);
    this.userService.MetodoUsuario(this.users);
    this.newUser = { id: 0, name: '', email: '', password: '', profile: '' };
    this.loadUsers();
    // Close modal
    const addUserModal = document.getElementById('addUserModal');
    const modalInstance = bootstrap.Modal.getInstance(addUserModal);
    modalInstance.hide();
  }

  /**
   * @description 
   * Maneja la edición de un usuario. Establece el usuario seleccionado y muestra el modal de edición.
   * 
   * @param {number} index - El índice del usuario a editar.
   * @return {void}
   */
  editUser(index: number): void {
    this.selectedUser = { ...this.users[index] };
    this.selectedIndex = index;
    // Show modal
    const editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
    editUserModal.show();
  }

  /**
   * @description 
   * Maneja la actualización de un usuario. Encripta la contraseña actualizada y guarda el usuario.
   * 
   * @return {void}
   */
  onUpdateUser(): void {
    if (this.selectedIndex !== null) {
      this.selectedUser.password = this.cryptoService.encrypt(this.selectedUser.password);
      this.users[this.selectedIndex] = this.selectedUser;
      this.userService.MetodoUsuario(this.users);
      this.selectedUser = { id: 0, name: '', email: '', password: '', profile: '' };
      this.selectedIndex = null;
      this.loadUsers();
      // Close modal
      const editUserModal = document.getElementById('editUserModal');
      const modalInstance = bootstrap.Modal.getInstance(editUserModal);
      modalInstance.hide();
    }
  }

  /**
   * @description 
   * Maneja la eliminación de un usuario. Elimina el usuario de la lista y guarda los cambios.
   * 
   * @param {number} index - El índice del usuario a eliminar.
   * @return {void}
   */
  deleteUser(index: number): void {
    this.users.splice(index, 1);
    this.userService.MetodoUsuario(this.users);
    this.loadUsers();
  }

  /**
   * @description 
   * Verifica el estado de inicio de sesión del usuario y redirige si no está logueado.
   * 
   * @return {void}
   */
  checkLoginState(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.userService.checkLoginState()) {
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
}