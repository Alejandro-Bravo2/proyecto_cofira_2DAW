import {Component, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Footer {
  currentYear = new Date().getFullYear();

  socialLinks = [
    {name: 'YouTube', url: 'https://youtube.com/@cofira', icon: 'youtube'},
    {name: 'Facebook', url: 'https://facebook.com/cofira', icon: 'facebook'},
    {name: 'Twitter', url: 'https://twitter.com/cofira', icon: 'twitter'},
    {name: 'Instagram', url: 'https://instagram.com/cofira', icon: 'instagram'},
    {name: 'LinkedIn', url: 'https://linkedin.com/company/cofira', icon: 'linkedin'}
  ];

  // Tema oscuro/claro
  modoOscuro = false;

  // Selector de idiomas
  idiomaActual = 'ES';
  idiomas = ['ES', 'EN', 'FR', 'DE'];
  mostrarIdiomas = false;

  constructor() {
    // Recuperar preferencia de tema guardada
    const temaGuardado = localStorage.getItem('tema');
    if (temaGuardado === 'oscuro') {
      this.modoOscuro = true;
      document.body.classList.add('modo-oscuro');
    }
  }

  toggleTema(): void {
    this.modoOscuro = !this.modoOscuro;
    document.body.classList.toggle('modo-oscuro', this.modoOscuro);
    localStorage.setItem('tema', this.modoOscuro ? 'oscuro' : 'claro');
  }

  cambiarIdioma(idioma: string): void {
    this.idiomaActual = idioma;
    this.mostrarIdiomas = false;
  }

  toggleIdiomas(): void {
    this.mostrarIdiomas = !this.mostrarIdiomas;
  }
}
