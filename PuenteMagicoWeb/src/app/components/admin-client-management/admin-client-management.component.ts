import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { CustomersService, Customer } from '../../services/customers.service';
declare var bootstrap: any;
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CryptoService } from '../../services/crypto.service';

@Component({
  selector: 'app-admin-client-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './admin-client-management.component.html',
  styleUrl: './admin-client-management.component.scss',
  providers: [CustomersService]
})
export class AdminClientManagementComponent implements OnInit, AfterViewInit {

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
	  private clientService: CustomersService,
    private usersService: UsersService,
    private router: Router,
    private cryptoService: CryptoService
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
  
  clients: Customer[] = [];
  newClient: Customer = { id: 0, clientName: '', clientSurname: '', email: '', password: '', birthdate: '', dispatchAddress: '' };
  selectedClient: Customer = { id: 0, clientName: '', clientSurname: '', email: '', password: '', birthdate: '', dispatchAddress: '' };
  selectedIndex: number | null = null;

  ngOnInit(): void {
    this.loadClients();
    this.checkLoginState();
  }

  loadClients(): void {
    this.clientService.getCustomers().subscribe(data => {
      this.clients = data;
    });
  }

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

  editClient(index: number): void {
    this.selectedClient = { ...this.clients[index] };
    this.selectedIndex = index;
    // Show modal
    const editClientModal = new bootstrap.Modal(document.getElementById('editClientModal'));
    editClientModal.show();
  }

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

  deleteClient(index: number): void {
    this.clients.splice(index, 1);
    this.clientService.MetodoCliente(this.clients);
    this.loadClients();
  }

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