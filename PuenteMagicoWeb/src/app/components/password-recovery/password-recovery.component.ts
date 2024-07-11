import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomersService } from '../../services/customers.service';
import { Renderer2, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.scss'
})
export class PasswordRecoveryComponent implements OnInit, AfterViewInit {
  passwordRecoveryForm: FormGroup;

  /**
   * @description 
   * Constructor del componente PasswordRecoveryComponent. Inicializa los servicios necesarios y configura el formulario reactivo.
   * 
   * @param {NavigationService} navigationService - Servicio de navegación.
   * @param {Object} platformId - Identificador de la plataforma.
   * @param {FormBuilder} fb - Constructor de formularios reactivos.
   * @param {CustomersService} customersService - Servicio de clientes.
   * @param {Renderer2} renderer - Servicio de renderizado.
   * @param {ElementRef} el - Referencia al elemento HTML.
   * @param {Router} router - Servicio de enrutamiento.
   */
  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
	  private fb: FormBuilder,
    private customersService: CustomersService,
    private renderer: Renderer2,
    private el: ElementRef,
    private router: Router) { 
      this.passwordRecoveryForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]});
	}

  /**
   * @description 
   * Hook de inicialización del componente. Verifica el estado de inicio de sesión.
   * 
   * @return {void}
   */
  ngOnInit(): void {
    this.checkLoginState();
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
   * Maneja el envío del formulario de recuperación de contraseña. Valida el correo electrónico y, si es válido, simula el envío de un enlace de recuperación de contraseña.
   * 
   * @return {void}
   */
  onSubmit() {
    if (this.passwordRecoveryForm.valid) {
      const email = this.passwordRecoveryForm.value.email;

      this.customersService.validateEmail(email).subscribe(
        emailExists => {
          if (emailExists) {
            console.log('Cliente encontrado:', { email });
            this.customersService.mostrarAlerta('Cliente encontrado.', 'success');
            alert('Se ha enviado un enlace de recuperación de contraseña a su correo electrónico.!');
            // Redirigir al perfil del usuario
            this.router.navigate(['/login']);
          } else {
            console.log('Error cliente no encontrado.');
            this.customersService.mostrarAlerta('Cliente no encontrado.', 'danger');
          }
        },
        error => {
          console.error('Error al validar el correo electrónico:', error);
        }
      );
    } else {
      console.log('Formulario invalido');
    }
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
      }
    }
  }
}
