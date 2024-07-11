import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-logout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-logout.component.html',
  styleUrl: './admin-logout.component.scss'
})
export class AdminLogoutComponent implements OnInit, AfterViewInit {

  /**
   * @description
   * Constructor del componente AdminLogoutComponent.
   * 
   * @param {NavigationService} navigationService - Servicio de navegación.
   * @param {Object} platformId - Identificador de la plataforma.
   * @param {UsersService} usersService - Servicio de usuarios.
   * @param {Router} router - Servicio de enrutamiento.
   */
  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private usersService: UsersService,
    private router: Router
  ) { }

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
   * Hook que se ejecuta después de que la vista ha sido inicializada. Configura la navegación con retardo para los enlaces y realiza el cierre de sesión.
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
    this.usersService.logout();
    this.checkLoginState();
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
        // Redirigir al administrador
        // this.router.navigate(['/admin-user-management']);
        console.log('Usuario logueado.');
      } else {
        // Redirigir al administrador
        // this.router.navigate(['/admin-login']);
        console.log('Usuario no logueado.');
      }
    }
  }
}