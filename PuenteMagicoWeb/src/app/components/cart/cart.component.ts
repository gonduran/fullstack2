import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements AfterViewInit {

  constructor(
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
  }
}
