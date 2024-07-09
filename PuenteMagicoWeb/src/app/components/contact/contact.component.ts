import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactsService, Contact } from '../../services/contacts.service';
import { Renderer2, ElementRef } from '@angular/core';
import { CustomersService } from '../../services/customers.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  providers: [ContactsService]
})
export class ContactComponent implements OnInit, AfterViewInit {
  contactForm: FormGroup;

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private customersService: CustomersService,
    private contactsService: ContactsService,
    private renderer: Renderer2,
    private el: ElementRef) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.checkLoginState();
  }

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
   * Maneja el envío del formulario de contacto. Realiza las validaciones y registra el mensaje.
   * 
   * @return {void}
   */
  onSubmit() {
    if (this.contactForm.valid) {

      const fecha = new Date();
      
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, '0');
      const day = String(fecha.getDate()).padStart(2, '0');

      const formattedDate = `${year}-${month}-${day}`;

      const estado = 'Nuevo';
      const newContact : Contact = {
        id: 0, // This will be set in the service
        name: this.contactForm.value.name,
        email: this.contactForm.value.email,
        phone: this.contactForm.value.phone,
        subject: this.contactForm.value.subject,
        message: this.contactForm.value.message,
        fecha: this.formatToStorageDate(formattedDate),
        estado: estado
      };

      this.contactsService.addContact(newContact).subscribe(
        () => {
          this.contactsService.mostrarAlerta('Contacto cliente registrado exitosamente.', 'success');
          console.log('Contacto cliente registrado exitosamente:', newContact);
          //alert('Registro exitoso!');
          this.contactForm.reset();
        },
        error => {
          alert('Error: ' + error.message);
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }

  onReset() {
    this.contactForm.reset();
  }

  checkLoginState(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.customersService.checkLoginState()) {
        // Ocultar el menú "Iniciar Sesión" y "Registro Cliente"
        document.getElementById('loginMenu')!.style.display = 'none';
        document.getElementById('registerMenu')!.style.display = 'none';
        // Mostrar el menú "Perfil Cliente" y "Cerrar Sesión"
        document.getElementById('profileMenu')!.style.display = 'block';
        document.getElementById('logoutMenu')!.style.display = 'block';
      } else {
        // Ocultar el menú "Perfil Cliente" y "Cerrar Sesión"
        document.getElementById('profileMenu')!.style.display = 'none';
        document.getElementById('logoutMenu')!.style.display = 'none';
        // Mostrar el menú "Iniciar Sesión" y "Registro Cliente"
        document.getElementById('loginMenu')!.style.display = 'block';
        document.getElementById('registerMenu')!.style.display = 'block';
      }
    }
  }

  /**
   * @description 
   * Formatea una fecha de almacenamiento en el formato DD-MM-YYYY.
   * 
   * @param {string} date - La fecha en formato YYYY-MM-DD.
   * @return {string} - La fecha formateada en el formato DD-MM-YYYY.
   */
  formatToFormDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

  /**
   * @description 
   * Formatea una fecha de formulario en el formato YYYY-MM-DD.
   * 
   * @param {string} date - La fecha en formato DD-MM-YYYY.
   * @return {string} - La fecha formateada en el formato YYYY-MM-DD.
   */
  formatToStorageDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }
}
