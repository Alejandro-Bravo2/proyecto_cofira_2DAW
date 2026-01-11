import {Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Button} from '../../shared/button/button';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Button],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Header {
  private readonly authService = inject(AuthService);

  // Signals de autenticación
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly userNombre = this.authService.userNombre;

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

  logout(): void {
    this.authService.logout();
    this.cerrarMenuCuenta();
  }
}
