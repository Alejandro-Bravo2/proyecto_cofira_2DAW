import {Component, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {Button} from '../../shared/button/button';
import {AuthService} from '../../../services/auth.service';
import {ThemeService} from '../../../services/theme.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Button],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Header {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly userNombre = this.authService.userNombre;

  menuAbierto = false;
  menuCuentaAbierto = false;

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

  
  get modoOscuro(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleTema(): void {
    this.themeService.toggle();
  }

  logout(): void {
    this.authService.logout();
    this.cerrarMenuCuenta();
  }
}
