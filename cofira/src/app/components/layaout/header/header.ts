import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Header {
  menuAbierto = false;
  menuCuentaAbierto = false;
  modoOscuro = false;

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }

  cerrarMenu() {
    this.menuAbierto = false;
  }

  toggleMenuCuenta() {
    this.menuCuentaAbierto = !this.menuCuentaAbierto;
  }

  cerrarMenuCuenta() {
    this.menuCuentaAbierto = false;
  }

  toggleModoOscuro() {
    this.modoOscuro = !this.modoOscuro;
    document.body.classList.toggle('modo-oscuro', this.modoOscuro);
  }
}
