import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  navigateWithDelay(href: string, delay: number = 1000) {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (loadingScreen) {
      loadingScreen.classList.add('active');
    }
    
  setTimeout(() => {
      // Verificar si el href es una URL relativa que debe ser manejada por el router
      if (href.startsWith('/')) {
        this.router.navigateByUrl(href).then(() => {
          if (loadingScreen) {
            loadingScreen.classList.remove('active');
          }
        });
      } else {
        window.location.href = href;
      }
    }, delay);
  }
}
