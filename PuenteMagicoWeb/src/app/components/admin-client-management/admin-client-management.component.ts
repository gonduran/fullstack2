import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { CustomersService } from '../../services/customers.service';
declare var bootstrap: any;
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

interface Customer {
  clientName: string;
  clientSurname: string;
  email: string;
  password: string;
  birthdate: string;
  dispatchAddress: string;
}

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
    private customersService: CustomersService,
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
  customers: Customer[] = [];
  newClient: Customer = { clientName: '', clientSurname: '', email: '', password: '', birthdate: '', dispatchAddress: '' };
  selectedClient: Customer = { clientName: '', clientSurname: '', email: '', password: '', birthdate: '', dispatchAddress: '' };
  selectedIndex: number | null = null;

  ngOnInit(): void {
    if (this.clientService.isLocalStorageAvailable()) {
      this.loadClients();
    }
    this.checkLoginState();
    this.loadCustomers();
  }

  loadClients(): void {
    this.clients = this.clientService.getClients();
  }

  onAddClient(): void {
    this.clientService.addClient(this.newClient);
    this.newClient = { clientName: '', clientSurname: '', email: '', password: '', birthdate: '', dispatchAddress: '' };
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
      this.clientService.updateClient(this.selectedIndex, this.selectedClient);
      this.selectedClient = { clientName: '', clientSurname: '', email: '', password: '', birthdate: '', dispatchAddress: '' };
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

  loadCustomers(): void {
    this.customersService.getCustomers().subscribe(
      (data) => {
        this.customers = data;
      },
      (error) => {
        console.error('Error al recuperar clientes', error);
      }
    );
  }

  onRegisterCustomer(newCustomer: Customer): void {
    this.customersService.registerCustomers(newCustomer).subscribe(
      (customer) => {
        this.customers.push(customer);
      },
      (error) => {
        console.error('Error al registrar el cliente', error);
      }
    );
  }

  onUpdateCustomer(updatedCustomer: Customer): void {
    this.customersService.updateCustomers(updatedCustomer).subscribe(
      (customer) => {
        const index = this.customers.findIndex(c => c.email === customer.email);
        if (index !== -1) {
          this.customers[index] = customer;
        }
      },
      (error) => {
        console.error('Error al actualizar el cliente', error);
      }
    );
  }

  onDeleteCustomer(email: string): void {
    this.customersService.deleteCustomers(email).subscribe(
      () => {
        this.customers = this.customers.filter(c => c.email !== email);
      },
      (error) => {
        console.error('Error deleting customer', error);
      }
    );
  }
}