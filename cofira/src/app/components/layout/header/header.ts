import {Component, HostListener, inject, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faChartLine, faMoon, faSun} from '@fortawesome/free-solid-svg-icons';
import {Button} from '../../shared/button/button';
import {AuthService} from '../../../services/auth.service';
import {ThemeService} from '../../../services/theme.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, Button, FaIconComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Header {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly userNombre = this.authService.userNombre;

  readonly iconoSol = faSun;
  readonly iconoLuna = faMoon;
    readonly iconoGrafico = faChartLine;

  menuAbierto = false;
  menuCuentaAbierto = false;

  @HostListener("document:keydown.escape")
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

  navegar(ruta: string): void {
    this.router.navigate([ruta]);
  }

  logout(): void {
    this.authService.logout();
    this.cerrarMenuCuenta();
  }
}
