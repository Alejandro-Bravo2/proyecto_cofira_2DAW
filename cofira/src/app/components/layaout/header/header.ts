import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
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
    // Aquí podrías agregar la lógica para cambiar el tema de toda la aplicación
    document.body.classList.toggle('modo-oscuro', this.modoOscuro);
  }
}
