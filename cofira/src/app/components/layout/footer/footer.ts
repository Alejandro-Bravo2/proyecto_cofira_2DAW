import {Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';

import {ThemeService} from '../../../services/theme.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Footer {
  private readonly themeService = inject(ThemeService);

  currentYear = new Date().getFullYear();

  socialLinks = [
    {name: 'YouTube', url: 'https://youtube.com/@cofira', icon: 'youtube'},
    {name: 'Facebook', url: 'https://facebook.com/cofira', icon: 'facebook'},
    {name: 'Twitter', url: 'https://twitter.com/cofira', icon: 'twitter'},
    {name: 'Instagram', url: 'https://instagram.com/cofira', icon: 'instagram'},
    {name: 'LinkedIn', url: 'https://linkedin.com/company/cofira', icon: 'linkedin'}
  ];

  // Selector de idiomas
  idiomaActual = 'ES';
  idiomas = ['ES', 'EN', 'FR', 'DE'];
  mostrarIdiomas = false;

  // Getter para el estado del tema (usa el servicio)
  get modoOscuro(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleTema(): void {
    this.themeService.toggle();
  }

  cambiarIdioma(idioma: string): void {
    this.idiomaActual = idioma;
    this.mostrarIdiomas = false;
  }

  toggleIdiomas(): void {
    this.mostrarIdiomas = !this.mostrarIdiomas;
  }
}
