import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Renderer2, ElementRef } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent implements OnInit, AfterViewInit {
  adminLoginForm: FormGroup;

  /**
   * @description
   * Constructor del componente AdminLoginComponent.
   * 
   * @param {NavigationService} navigationService - Servicio de navegación.
   * @param {Object} platformId - Identificador de la plataforma.
   * @param {FormBuilder} fb - Constructor de formularios reactivos.
   * @param {UsersService} usersService - Servicio de usuarios.
   * @param {Renderer2} renderer - Servicio de renderizado.
   * @param {ElementRef} el - Referencia al elemento HTML.
   * @param {CryptoService} cryptoService - Servicio de encriptación.
   * @param {Router} router - Servicio de enrutamiento.
   */
  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private usersService: UsersService,
    private renderer: Renderer2,
    private el: ElementRef,
    private cryptoService: CryptoService,
    private router: Router
  ) { 
    this.adminLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
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
   * Maneja el envío del formulario de inicio de sesión de administrador. Valida las credenciales y realiza la autenticación.
   * 
   * @return {void}
   */
  onSubmit(): void {
    if (this.adminLoginForm.valid) {
      const email = this.adminLoginForm.value.email;
      const password = this.adminLoginForm.value.password;

      this.usersService.validateLogin(email, password).subscribe(isValid => {
        if (isValid) {
          console.log('Inicio de sesión exitoso:', { email });
          this.usersService.mostrarAlerta('Inicio de sesión exitoso.', 'success');
          // Redirigir al administrador
          alert('Inicio de sesión exitoso!');
          this.router.navigate(['/admin-user-management']);
        } else {
          console.log('Email o contraseña incorrectos.');
          this.usersService.mostrarAlerta('Email o contraseña incorrectos.', 'danger');
        }
      });
    } else {
      console.log('Formulario invalido');
    }
  }

  /**
   * @description
   * Verifica el estado de inicio de sesión del usuario y redirige según el estado.
   * 
   * @return {void}
   */
  checkLoginState(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.usersService.checkLoginState()) {
        // Redirigir al perfil del usuario
        this.router.navigate(['/admin-user-management']);
      } else {
        console.log('Administrador no logueado.');
      }
    }
  }
}