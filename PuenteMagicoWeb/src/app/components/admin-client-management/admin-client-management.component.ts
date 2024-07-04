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

/*interface Customer {
  clientName: string;
  clientSurname: string;
  email: string;
  password: string;
  birthdate: string;
  dispatchAddress: string;
}*/

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
  
  clients: Customer[] = [];
  newClient: Customer = { id: 0, clientName: '', clientSurname: '', email: '', password: '', birthdate: '', dispatchAddress: '' };
  selectedClient: Customer = { id: 0, clientName: '', clientSurname: '', email: '', password: '', birthdate: '', dispatchAddress: '' };
  selectedIndex: number | null = null;

  ngOnInit(): void {
    //if (this.clientService.isLocalStorageAvailable()) {
      this.loadClients();
    //}
    this.checkLoginState();
  }

  loadClients(): void {
    //this.clients = this.clientService.getClients();
    this.clientService.getCustomers().subscribe(data => {
      this.clients = data;
    });
  }

  onAddClient(): void {
    this.newClient.id = this.clients.length > 0 ? Math.max(...this.clients.map((p: any) => p.id)) + 1 : 1;
    //this.clientService.addClient(this.newClient);
    console.log('Clientes antes:', this.clients);
    console.log('Cliente nuevo:', this.newClient);
    this.clients.push(this.newClient);
    //localStorage.setItem(this.storageKey, JSON.stringify(clients));
    this.clientService.MetodoCliente(this.clients);
    console.log('Clientes post:', this.clients);
    this.newClient = { id: 0, clientName: '', clientSurname: '', email: '', password: '', birthdate: '', dispatchAddress: '' };
    console.log('Cliente insertado.');
    this.loadClients();
    console.log('Cliente mostrado.');
    // Close modal
    const addClientModal = document.getElementById('addClientModal');
    const modalInstance = bootstrap.Modal.getInstance(addClientModal);
    modalInstance.hide();
    console.log('Cliente fin.');
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
      this.clientService.updateClient(this.selectedIndex, this.selectedClient);
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
    this.clientService.deleteClient(index);
    this.loadClients();
  }

  checkLoginState(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.usersService.checkLoginState()) {
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