import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CustomersService } from '../../services/customers.service';
import { Renderer2, ElementRef } from '@angular/core';
import { CryptoService } from '../../services/crypto.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements AfterViewInit {
  profileForm: FormGroup;

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private customersService: CustomersService,
    private renderer: Renderer2,
    private el: ElementRef,
    private cryptoService: CryptoService) { 
      this.profileForm = this.fb.group({
      clientName: ['', Validators.required],
      clientSurname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.pattern('(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{6,18}$')]],
      confirmPassword: [''],
      birthDate: ['', Validators.required],
      dispatchAddress: ['']
      }, { validator: this.passwordMatchValidator });
	}

  ngOnInit(): void {
    this.checkLoginState();
    this.loadClientData();
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
    if (!(form.get('password')?.value === '')) {
      return form.get('password')?.value === form.get('confirmPassword')?.value ? null : { mismatch: true };
    }
    return true;
  }

  calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const age = this.calculateAge(this.profileForm.value.birthDate);
      if (age < 13) {
        alert('Debe tener al menos 13 años para registrarse.');
        return;
      }

      const clientName = this.profileForm.value.clientName;
      const clientSurname = this.profileForm.value.clientSurname;
      const email = this.profileForm.value.email;
      const password = this.profileForm.value.password;
      const birthDate = this.formatToStorageDate(this.profileForm.value.birthDate);
      const dispatchAddress = this.profileForm.value.dispatchAddress;

      //localStorage.setItem('user', JSON.stringify(userData));
      const updateExitoso = this.customersService.updateCustomer(clientName, clientSurname, email, password, birthDate, dispatchAddress);
      if (updateExitoso) {
        console.log('Actualizacion exitosa:', { clientName, clientSurname, email, password, birthDate, dispatchAddress });
        alert('Actualizacion exitosa!');
        this.profileForm.reset();
      } else {
        console.log('Error en la actualización.');
      }
    } else {
      console.log('Formulario invalido');
    }
  }

  onReset() {
    this.profileForm.reset();
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

  loadClientData(): void {
    if (this.customersService.isLocalStorageAvailable()) {
      const userData = JSON.parse(localStorage.getItem('loggedInClient') || '{}');
      if (userData) {
        console.log('Cliente logueado:', { userData });
        
        this.profileForm.patchValue({
          clientName: userData.clientName || '',
          clientSurname: userData.clientSurname || '',
          email: userData.email || '',
          password: '',
          confirmPassword: '',
          birthDate: userData.birthDate ? this.formatToFormDate(userData.birthDate) : '',
          dispatchAddress: userData.dispatchAddress || ''
        });
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
