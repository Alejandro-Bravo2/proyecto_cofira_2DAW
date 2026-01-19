import {Component, HostListener, inject, ViewEncapsulation} from '@angular/core';
import {RouterLink} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faSun, faMoon} from '@fortawesome/free-solid-svg-icons';
import {Button} from '../../shared/button/button';
import {AuthService} from '../../../services/auth.service';
import {ThemeService} from '../../../services/theme.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, Button, FaIconComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Header {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly userNombre = this.authService.userNombre;

  readonly iconoSol = faSun;
  readonly iconoLuna = faMoon;

  menuAbierto = false;
  menuCuentaAbierto = false;

  @HostListener('document:keydown.escape')
  cerrarMenusConEscape(): void {
    this.cerrarMenu();
    this.cerrarMenuCuenta();
  }

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
