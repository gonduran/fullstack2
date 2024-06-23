import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomersService } from '../../services/customers.service';
import { Renderer2, ElementRef } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit, AfterViewInit {
  registerForm: FormGroup;

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private customersService: CustomersService,
    private renderer: Renderer2,
    private el: ElementRef,
    private cryptoService: CryptoService,
    private router: Router) { 
      this.registerForm = this.fb.group({
      clientName: ['', Validators.required],
      clientSurname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,18}$')]],
      confirmPassword: ['', Validators.required],
      birthdate: ['', Validators.required],
      dispatchAddress: ['']
      }, { validator: this.passwordMatchValidator });
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

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
  }

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

  onSubmit() {
    if (this.registerForm.valid) {
      const age = this.calculateAge(this.registerForm.value.birthdate);
      if (age < 13) {
        alert('Debe tener al menos 13 años para registrarse.');
        return;
      }

      const clientName = this.registerForm.value.clientName;
      const clientSurname = this.registerForm.value.clientSurname;
      const email = this.registerForm.value.email;
      const password = this.cryptoService.encrypt(this.registerForm.value.password);
      const birthdate = this.formatToStorageDate(this.registerForm.value.birthdate);
      const dispatchAddress = this.registerForm.value.dispatchAddress;

      //localStorage.setItem('user', JSON.stringify(userData));
      const registroExitoso = this.customersService.registerCustomer(clientName, clientSurname, email, password, birthdate, dispatchAddress);
      if (registroExitoso) {
        console.log('Registro exitoso:', { clientName, clientSurname, email, password, birthdate, dispatchAddress });
        alert('Registro exitoso!');
        this.registerForm.reset();
      } else {
        console.log('Error en el registro.');
      }
    } else {
      console.log('Formulario invalido');
    }
  }

  onReset(): void {
    this.registerForm.reset({
      clientName: '',
      clientSurname: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthdate: '',
      dispatchAddress: ''
    });
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
        // Redirigir al perfil del cliente
        this.router.navigate(['/profile']);
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

  formatToFormDate(date: string): string {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  }

  formatToStorageDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`;
  }
}
