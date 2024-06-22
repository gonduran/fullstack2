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

  onSubmit() {
    if (this.passwordRecoveryForm.valid) {
      const email = this.passwordRecoveryForm.value.email;

      //localStorage.setItem('user', JSON.stringify(userData));
      const clienteEncontrado = this.customersService.findCustomer(email);
      if (clienteEncontrado) {
        console.log('Cliente encontrado:', { email });
        alert('Se ha enviado un enlace de recuperación de contraseña a su correo electrónico.!');
        // Redirigir al perfil del usuario
        this.router.navigate(['/login']);
      } else {
        console.log('Error cliente no encontrado.');
      }
    } else {
      console.log('Formulario invalido');
    }
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
}
