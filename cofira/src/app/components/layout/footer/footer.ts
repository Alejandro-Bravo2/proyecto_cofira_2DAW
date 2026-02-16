import {Component, ElementRef, HostListener, inject, ViewEncapsulation} from '@angular/core';
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
  private readonly elementRef = inject(ElementRef);

  anioActual = new Date().getFullYear();

  socialLinks = [
    {name: "YouTube", url: "https://youtube.com/cofira"},
    {name: "Facebook", url: "https://facebook.com/cofira"},
    {name: "Twitter", url: "https://twitter.com/cofira"},
    {name: "Instagram", url: "https://instagram.com/cofira"},
    {name: "LinkedIn", url: "https://linkedin.com/company/cofira"},
  ];

  idiomaActual = "ES";
  idiomas = ["ES", "EN", "FR", "DE"];
  mostrarIdiomas = false;

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

  @HostListener("document:keydown.escape")
  cerrarIdiomasConEscape(): void {
    this.mostrarIdiomas = false;
  }

  @HostListener('document:click', ['$event'])
  cerrarIdiomasSiClicFuera(evento: Event): void {
    const elementoClicado = evento.target as HTMLElement;
    const contenedorIdioma = this.elementRef.nativeElement.querySelector('.pie__idioma');

    const clicFueDelSelectorIdioma = !contenedorIdioma?.contains(elementoClicado);

    if (clicFueDelSelectorIdioma) {
      this.mostrarIdiomas = false;
    }
  }
}
