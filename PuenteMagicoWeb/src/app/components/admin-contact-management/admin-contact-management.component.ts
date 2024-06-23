import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { ContactsService } from '../../services/contacts.service';
declare var bootstrap: any;
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';

interface Contact {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  fecha: Date;
  estado: string;
  id: number;
}

@Component({
  selector: 'app-admin-contact-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-contact-management.component.html',
  styleUrl: './admin-contact-management.component.scss'
})
export class AdminContactManagementComponent implements OnInit, AfterViewInit {

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
	  private contactService: ContactsService,
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
  
  contacts: Contact[] = [];

  ngOnInit(): void {
    if (this.contactService.isLocalStorageAvailable()) {
      this.loadContacts();
    }
    this.checkLoginState();
  }

  loadContacts(): void {
    this.contacts = this.contactService.getContacts();
  }

  toggleEstado(index: number): void {
    const contact = this.contacts[index];
    contact.estado = contact.estado === 'Nuevo' ? 'Procesado' : 'Nuevo';
    this.contactService.updateContact(index, contact);
    this.loadContacts();
  }

  deleteContact(index: number): void {
    this.contactService.deleteContact(index);
    this.loadContacts();
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