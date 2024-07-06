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

interface User {
  name: string;
  email: string;
  password: string;
  profile: string;
}

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent implements OnInit, AfterViewInit {
  adminLoginForm: FormGroup;

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
	  private fb: FormBuilder,
    private usersService: UsersService,
    private renderer: Renderer2,
    private el: ElementRef,
    private cryptoService: CryptoService,
    private router: Router) { 
      this.adminLoginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]});
	}

  userAdminDefault: User = { name: 'Administrador', email: 'admin@puente-magico.cl', password: 'P4ss2511', profile: 'Admin' };

  ngOnInit(): void {
    if (this.usersService.isLocalStorageAvailable()) {
      const email = this.userAdminDefault.email;
      if (this.usersService.findUserAdmin(email)) {
        console.log('Administrador encontrado:');
      } else {
        console.log('Administrador no encontrado.');
        this.usersService.addUser(this.userAdminDefault);
      }
    }
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
    if (this.usersService.isLocalStorageAvailable()) {
      const email = this.userAdminDefault.email;
      if (this.usersService.findUserAdmin(email)) {
        console.log('Administrador encontrado:');
      } else {
        console.log('Administrador no encontrado.');
        this.usersService.addUser(this.userAdminDefault);
      }
    }
  }

  onSubmit() {
    if (this.adminLoginForm.valid) {
      const email = this.adminLoginForm.value.email;
      const password = this.adminLoginForm.value.password;

      //localStorage.setItem('user', JSON.stringify(userData));
      const loginExitoso = this.usersService.iniciarSesion(email, password);
      if (loginExitoso) {
        console.log('Inicio de sesión exitoso:', { email });
        alert('Inicio de sesión exitoso!');
        // Redirigir al administrador
        this.router.navigate(['/admin-user-management']);
      } else {
        console.log('Error en el inicio de sesión.');
      }
    } else {
      console.log('Formulario invalido');
    }
  }

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
