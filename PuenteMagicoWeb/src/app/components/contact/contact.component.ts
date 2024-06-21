import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../navigation.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit, AfterViewInit {
  contactForm: FormGroup;

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Lógica que debe ejecutarse cuando el componente se inicializa
    console.log('ngOnInit ejecutado');
  }

  ngAfterViewInit(): void {
    // Lógica que debe ejecutarse después de que la vista del componente se ha inicializado
    console.log('ngAfterViewInit ejecutado');
    this.setupFormInteractivity();
    this.addFormSubmitListener();
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
    if (this.contactForm.valid) {
      console.log('Form Submitted!', this.contactForm.value);
      // Aquí puedes manejar el envío del formulario, por ejemplo, enviando los datos a un servidor
      this.contactForm.reset();
    } else {
      console.log('Form is invalid');
    }
  }

  onReset() {
    this.contactForm.reset();
  }

  private setupFormInteractivity() {
    // Ejemplo de alguna lógica que necesita acceder a elementos del DOM
    const nameInput = document.getElementById('name');
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        console.log('Name input value:', (nameInput as HTMLInputElement).value);
      });
    }
  }

  private addFormSubmitListener() {
    const form = document.getElementById('contactForm');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = (document.getElementById('name') as HTMLInputElement).value.trim();
        const email = (document.getElementById('email') as HTMLInputElement).value.trim();
        const subject = (document.getElementById('subject') as HTMLInputElement).value.trim();
        const message = (document.getElementById('message') as HTMLInputElement).value.trim();

        if (name === '' || email === '' || subject === '' || message === '') {
          alert('Por favor rellene todos los campos.');
          return;
        }

        // Aquí se debe agregar el código para enviar el formulario a un servidor o manejarlo de otra manera
        alert('Tu mensaje ha sido enviado!');
        this.contactForm.reset();
      });
    }
  }

}
