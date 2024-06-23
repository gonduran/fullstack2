import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { CustomersService } from '../../services/customers.service';
declare var bootstrap: any;
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-client-management.component.html',
  styleUrl: './admin-client-management.component.scss'
})
export class AdminClientManagementComponent implements AfterViewInit {

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
	  private clientService: CustomersService
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
  newClient: Customer = { clientName: '', clientSurname: '', email: '', password: '', birthdate: '', dispatchAddress: '' };
  selectedClient: Customer = { clientName: '', clientSurname: '', email: '', password: '', birthdate: '', dispatchAddress: '' };
  selectedIndex: number | null = null;

  ngOnInit(): void {
    if (this.clientService.isLocalStorageAvailable()) {
      this.loadClients();
    }
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
}
