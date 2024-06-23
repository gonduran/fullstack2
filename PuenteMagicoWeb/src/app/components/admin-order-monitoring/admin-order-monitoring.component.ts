import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-order-monitoring',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-order-monitoring.component.html',
  styleUrl: './admin-order-monitoring.component.scss'
})
export class AdminOrderMonitoringComponent implements OnInit, AfterViewInit {

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private usersService: UsersService,
    private router: Router
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
  }

  ngOnInit(): void {
    this.checkLoginState();
  }

  checkLoginState(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.usersService.checkLoginState()) {
        // Redirigir al administrador
        //this.router.navigate(['/admin-user-management']);
        console.log('Usuario logueado.');
      } else {
        // Redirigir al administrador
        this.router.navigate(['/admin-login']);
        console.log('Usuario no logueado.');
      }
    }
  }
}
