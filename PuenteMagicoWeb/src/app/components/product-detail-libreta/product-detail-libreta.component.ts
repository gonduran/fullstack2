import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { NavigationService } from '../../services/navigation.service';
declare var bootstrap: any;

@Component({
  selector: 'app-product-detail-libreta',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail-libreta.component.html',
  styleUrl: './product-detail-libreta.component.scss'
})
export class ProductDetailLibretaComponent implements AfterViewInit {

  constructor(
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: Object) { }

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
      //Inicializar Carousel() de imagenes
      if (typeof document !== 'undefined') {
        const carouselElement = document.querySelector('#productCarousel') as HTMLElement;
        if (carouselElement) {
          const carousel = new bootstrap.Carousel(carouselElement, {
            interval: 3000, // Cambia de imagen cada 2 segundos
            ride: 'carousel'
          });
        }
      }
    }
  }
}
