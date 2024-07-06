import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { CustomersService, Customer } from '../../services/customers.service';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CryptoService } from '../../services/crypto.service';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-client-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './admin-client-management.component.html',
  styleUrls: ['./admin-client-management.component.scss'],
  providers: [CustomersService]
})
export class AdminClientManagementComponent implements OnInit, AfterViewInit {

  clients: Customer[] = [];
  newClient: Customer = { id: 0, clientName: '', clientSurname: '', email: '', password: '', birthdate: '', dispatchAddress: '' };
  selectedClient: Customer = { id: 0, clientName: '', clientSurname: '', email: '', password: '', birthdate: '', dispatchAddress: '' };
  selectedIndex: number | null = null;

  /**
   * @description 
   * Constructor del componente AdminClientManagementComponent.
   * 
   * @param {NavigationService} navigationService - Servicio de navegación.
   * @param {Object} platformId - Identificador de la plataforma.
   * @param {CustomersService} clientService - Servicio de clientes.
   * @param {UsersService} usersService - Servicio de usuarios.
   * @param {Router} router - Servicio de enrutamiento.
   * @param {CryptoService} cryptoService - Servicio de encriptación.
   */
  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private clientService: CustomersService,
    private usersService: UsersService,
    private router: Router,
    private cryptoService: CryptoService
  ) { }

  /**
   * @description 
   * Hook que se ejecuta después de que la vista ha sido inicializada. Configura la navegación con retardo para los enlaces.
   * 
   * @return {void}
   */
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

  /**
   * @description 
   * Hook de inicialización del componente. Carga la lista de clientes y verifica el estado de inicio de sesión.
   * 
   * @return {void}
   */
  ngOnInit(): void {
    this.loadClients();
    this.checkLoginState();
  }

  /**
   * @description 
   * Carga la lista de clientes desde el servicio de clientes.
   * 
   * @return {void}
   */
  loadClients(): void {
    this.clientService.getCustomers().subscribe(data => {
      this.clients = data;
    });
  }

  /**
   * @description 
   * Maneja la adición de un nuevo cliente. Asigna un ID único, encripta la contraseña y guarda el cliente.
   * 
   * @return {void}
   */
  onAddClient(): void {
    this.newClient.id = this.clients.length > 0 ? Math.max(...this.clients.map((p: any) => p.id)) + 1 : 1;
    this.newClient.password = this.cryptoService.encrypt(this.newClient.password);
    this.clients.push(this.newClient);
    this.clientService.MetodoCliente(this.clients);
    this.newClient = { id: 0, clientName: '', clientSurname: '', email: '', password: '', birthdate: '', dispatchAddress: '' };
    this.loadClients();
    // Close modal
    const addClientModal = document.getElementById('addClientModal');
    const modalInstance = bootstrap.Modal.getInstance(addClientModal);
    modalInstance.hide();
  }

  /**
   * @description 
   * Maneja la edición de un cliente. Establece el cliente seleccionado y muestra el modal de edición.
   * 
   * @param {number} index - El índice del cliente a editar.
   * @return {void}
   */
  editClient(index: number): void {
    this.selectedClient = { ...this.clients[index] };
    this.selectedIndex = index;
    // Show modal
    const editClientModal = new bootstrap.Modal(document.getElementById('editClientModal'));
    editClientModal.show();
  }

  /**
   * @description 
   * Maneja la actualización de un cliente. Encripta la contraseña actualizada y guarda el cliente.
   * 
   * @return {void}
   */
  onUpdateClient(): void {
    if (this.selectedIndex !== null) {
      this.selectedClient.password = this.cryptoService.encrypt(this.selectedClient.password);
      this.clients[this.selectedIndex] = this.selectedClient;
      this.clientService.MetodoCliente(this.clients);
      this.selectedClient = { id: 0, clientName: '', clientSurname: '', email: '', password: '', birthdate: '', dispatchAddress: '' };
      this.selectedIndex = null;
      this.loadClients();
      // Close modal
      const editClientModal = document.getElementById('editClientModal');
      const modalInstance = bootstrap.Modal.getInstance(editClientModal);
      modalInstance.hide();
    }
  }

  /**
   * @description 
   * Maneja la eliminación de un cliente. Elimina el cliente de la lista y guarda los cambios.
   * 
   * @param {number} index - El índice del cliente a eliminar.
   * @return {void}
   */
  deleteClient(index: number): void {
    this.clients.splice(index, 1);
    this.clientService.MetodoCliente(this.clients);
    this.loadClients();
  }

  /**
   * @description 
   * Verifica el estado de inicio de sesión del usuario y redirige si no está logueado.
   * 
   * @return {void}
   */
  checkLoginState(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.usersService.checkLoginState()) {
        // Redirigir al administrador
        console.log('Usuario logueado.');
      } else {
        // Redirigir al administrador
        this.router.navigate(['/admin-login']);
        console.log('Usuario no logueado.');
      }
    }
  }
}