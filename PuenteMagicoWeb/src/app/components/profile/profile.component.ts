import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomersService, Customer } from '../../services/customers.service';
import { Renderer2, ElementRef } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
  providers: [CustomersService]
})
export class ProfileComponent implements OnInit, AfterViewInit {
  profileForm: FormGroup;
  customer: Customer | undefined;

  /**
   * @description 
   * Constructor del componente ProfileComponent.
   * 
   * @param {NavigationService} navigationService - Servicio de navegación.
   * @param {Object} platformId - Identificador de la plataforma.
   * @param {FormBuilder} fb - Constructor de formularios reactivos.
   * @param {CustomersService} customersService - Servicio de clientes.
   * @param {Renderer2} renderer - Servicio de renderizado.
   * @param {ElementRef} el - Referencia al elemento HTML.
   * @param {CryptoService} cryptoService - Servicio de encriptación.
   * @param {Router} router - Servicio de enrutamiento.
   */
  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private customersService: CustomersService,
    private renderer: Renderer2,
    private el: ElementRef,
    private cryptoService: CryptoService,
    private router: Router) { 
      this.profileForm = this.fb.group({
      clientName: ['', Validators.required],
      clientSurname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.pattern('(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,18}$')]],
      confirmPassword: [''],
      birthdate: ['', Validators.required],
      dispatchAddress: ['']
      }, { validator: this.passwordMatchValidator });
  }

  /**
   * @description 
   * Hook de inicialización del componente. Verifica el estado de inicio de sesión y carga los datos del cliente.
   * 
   * @return {void}
   */
  ngOnInit(): void {
    this.checkLoginState();
    this.loadCustomerData();
  }

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
   * Valida que las contraseñas coincidan si se proporcionan.
   * 
   * @param {FormGroup} form - El formulario de perfil.
   * @return {null | Object} - Retorna null si las contraseñas coinciden o no se proporcionan, de lo contrario un objeto con el error.
   */
  passwordMatchValidator(form: FormGroup) {
    if (!(form.get('password')?.value === '')) {
      return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
    }
    return null;
  }

  /**
   * @description 
   * Calcula la edad del cliente basado en su fecha de nacimiento.
   * 
   * @param {string} birthdate - La fecha de nacimiento del cliente.
   * @return {number} - La edad del cliente.
   */
  calculateAge(birthdate: string): number {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  /**
   * @description 
   * Maneja el envío del formulario de perfil. Realiza las validaciones y actualiza al cliente.
   * 
   * @return {void}
   */
  onSubmit() {
    if (this.profileForm.valid && this.customer) {
      const age = this.calculateAge(this.profileForm.value.birthdate);
      if (age < 13) {
        alert('Debe tener al menos 13 años para registrarse.');
        return;
      }

      const updatedCustomer: Customer = {
        ...this.customer,
        clientName: this.profileForm.value.clientName,
        clientSurname: this.profileForm.value.clientSurname,
        birthdate: this.formatToStorageDate(this.profileForm.value.birthdate),
        dispatchAddress: this.profileForm.value.dispatchAddress
      };

      if (this.profileForm.value.password) {
        updatedCustomer.password = this.cryptoService.encrypt(this.profileForm.value.password);
      }

      this.customersService.updateCustomer(updatedCustomer).subscribe(
        () => {
          this.customersService.mostrarAlerta('Cliente actualizado exitosamente.', 'success');
          alert('Actualización exitosa!');
          // Actualizar los datos del cliente logueado en localStorage
          localStorage.setItem('loggedInClient', JSON.stringify(updatedCustomer));
        },
        error => {
          console.error('Error al actualizar el perfil cliente:', error);
        }
      );
    } else {
      console.log('Formulario inválido');
    }
  }

  /**
   * @description 
   * Restablece el formulario de perfil.
   * 
   * @return {void}
   */
  onReset(): void {
    this.profileForm.reset({
      clientName: '',
      clientSurname: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthdate: '',
      dispatchAddress: ''
    });
  }

  /**
   * @description 
   * Verifica el estado de inicio de sesión del cliente y actualiza la interfaz de usuario en consecuencia.
   * 
   * @return {void}
   */
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
        // Redirigir al registrar del cliente
        this.router.navigate(['/register']);
      }
    }
  }

  /**
   * @description 
   * Carga los datos del cliente logueado desde el archivo JSON y actualiza el formulario.
   * 
   * @return {void}
   */
  loadCustomerData(): void {
    const loggedInClientEmail = this.customersService.getLoggedInClientEmail();
    if (loggedInClientEmail) {
      this.customersService.getCustomerByEmail(loggedInClientEmail).subscribe(
        customer => {
          if (customer) {
            this.customer = customer;
            this.profileForm.patchValue({
              clientName: customer.clientName,
              clientSurname: customer.clientSurname,
              email: customer.email,
              birthdate: this.formatToFormDate(customer.birthdate),
              dispatchAddress: customer.dispatchAddress
            });
          }
        },
        error => {
          console.error('Error al cargar los datos del cliente:', error);
        }
      );
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
   * @param {string} date - La fecha en formatoDD-MM-YYYY.
	 * @return {string} - La fecha formateada en el formato YYYY-MM-DD.
   */
  formatToStorageDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }
}