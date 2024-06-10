import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../navigation.service';
import { UserService } from './user.service';
import { Renderer2, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements AfterViewInit {

  constructor(
    private userService: UserService,
    private renderer: Renderer2,
    private el: ElementRef,
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object
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

    // Manejar el formulario de registro
    const formRegister = this.el.nativeElement.querySelector('.registroForm form') as HTMLFormElement;
    console.log('Formulario de registro inicio');

    if (formRegister) {
      console.log('Formulario de registro formRegister');
      this.renderer.listen(formRegister, 'submit', (event: Event) => {
        event.preventDefault();
        event.stopPropagation();

        const fullname = (this.el.nativeElement.querySelector('#nombreCompleto') as HTMLInputElement).value;
        const username = (this.el.nativeElement.querySelector('#nombreUsuario') as HTMLInputElement).value;
        const email = (this.el.nativeElement.querySelector('#email') as HTMLInputElement).value;
        const password = (this.el.nativeElement.querySelector('#password') as HTMLInputElement).value;
        const confirmpassword = (this.el.nativeElement.querySelector('#confirmPassword') as HTMLInputElement).value;
        const birthdate = (this.el.nativeElement.querySelector('#fechaNacimiento') as HTMLInputElement).value;
        const dispatchaddress = (this.el.nativeElement.querySelector('#direccion') as HTMLInputElement).value;

        console.log('Formulario de registro enviado:', { fullname, username, email, birthdate, dispatchaddress });

        const registroExitoso = this.userService.registrarUsuario(fullname, username, email, password, birthdate, dispatchaddress);
        if (registroExitoso) {
          console.log('Registro exitoso:', { fullname, username, email, birthdate, dispatchaddress });
          formRegister.reset();
        } else {
          console.log('Error en el registro.');
        }
      });
    }
  else {
    console.log('Formulario de registro NO formRegister');
  }
  }
}
