import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { ContactsService, Contact } from '../../services/contacts.service';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

declare var bootstrap: any;

@Component({
  selector: 'app-admin-contact-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HttpClientModule],
  templateUrl: './admin-contact-management.component.html',
  styleUrl: './admin-contact-management.component.scss',
  providers: [ContactsService]
})
export class AdminContactManagementComponent implements OnInit, AfterViewInit {

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
	  private contactService: ContactsService,
    private usersService: UsersService,
    private router: Router
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
  
  contacts: Contact[] = [];

  /**
   * @description 
   * Hook de inicialización del componente. Carga la lista de clientes y verifica el estado de inicio de sesión.
   * 
   * @return {void}
   */
  ngOnInit(): void {
    this.loadContacts();
    this.checkLoginState();
  }

  /**
   * @description 
   * Carga la lista de clientes desde el servicio de clientes.
   * 
   * @return {void}
   */
  loadContacts(): void {
    this.contactService.getContacts().subscribe(data => {
      this.contacts = data;
    });
  }

  /**
   * @description 
   * Maneja el cambio de estado de un mensaje de contacto. Actualiza el estado del mensaje de contacto de la lista y guarda los cambios.
   * 
   * @param {number} index - El índice del mensaje de contacto a eliminar.
   * @return {void}
   */
  toggleEstado(index: number): void {
    const contact = this.contacts[index];
    contact.estado = contact.estado === 'Nuevo' ? 'Procesado' : 'Nuevo';
    this.contactService.MetodoContacto(this.contacts);
    this.loadContacts();
    this.contactService.mostrarAlerta('Mensaje contacto actualizado exitosamente.', 'success');
    console.log('Mensaje contacto actualizado exitosamente:', this.contacts[index]);
  }

  /**
   * @description 
   * Maneja la eliminación de un mensaje de contacto. Elimina el mensaje de contacto de la lista y guarda los cambios.
   * 
   * @param {number} index - El índice del mensaje de contacto a eliminar.
   * @return {void}
   */
  deleteContact(index: number): void {
    this.contacts.splice(index, 1);
    this.contactService.MetodoContacto(this.contacts);
    this.loadContacts();
    this.contactService.mostrarAlerta('Mensaje contacto eliminado exitosamente.', 'success');
    console.log('Mensaje contacto eliminado exitosamente:');
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