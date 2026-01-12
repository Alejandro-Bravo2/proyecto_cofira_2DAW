import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pruebas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pruebas.html',
  styleUrl: './pruebas.scss',
})
export class Pruebas {
  // Lista de iconos SVG optimizados disponibles
  iconos = [
    { nombre: 'arrow-left_opt', descripcion: 'Flecha izquierda para navegación' },
    { nombre: 'check', descripcion: 'Marca de verificación simple' },
    { nombre: 'check-circle_opt', descripcion: 'Check dentro de círculo' },
    { nombre: 'check-solid', descripcion: 'Check sólido (relleno)' },
    { nombre: 'clock', descripcion: 'Reloj para indicar tiempo' },
    { nombre: 'email', descripcion: 'Sobre de correo electrónico' },
    { nombre: 'exclamation-circle', descripcion: 'Signo de exclamación en círculo' },
    { nombre: 'exclamation-triangle', descripcion: 'Advertencia triangular' },
    { nombre: 'eye', descripcion: 'Ojo abierto (mostrar contraseña)' },
    { nombre: 'eye-off', descripcion: 'Ojo tachado (ocultar contraseña)' },
    { nombre: 'lock', descripcion: 'Candado de seguridad' },
    { nombre: 'shield-check', descripcion: 'Escudo con verificación' },
    { nombre: 'spinner', descripcion: 'Indicador de carga' },
    { nombre: 'user', descripcion: 'Icono de usuario' },
    { nombre: 'x-circle-solid', descripcion: 'X en círculo sólido (error)' },
  ];

  // Información de optimización de cada SVG (original vs optimizado con SVGO)
  optimizaciones = [
    {
      archivo: 'arrow-left_opt.svg',
      original: '157 bytes',
      optimizado: '149 bytes',
      reduccion: '5%',
    },
    { archivo: 'check.svg', original: '202 bytes', optimizado: '197 bytes', reduccion: '2%' },
    {
      archivo: 'check-circle_opt.svg',
      original: '234 bytes',
      optimizado: '226 bytes',
      reduccion: '3%',
    },
    { archivo: 'check-solid.svg', original: '257 bytes', optimizado: '258 bytes', reduccion: '0%' },
    { archivo: 'clock.svg', original: '180 bytes', optimizado: '172 bytes', reduccion: '4%' },
    { archivo: 'email.svg', original: '429 bytes', optimizado: '432 bytes', reduccion: '0%' },
    {
      archivo: 'exclamation-circle.svg',
      original: '255 bytes',
      optimizado: '246 bytes',
      reduccion: '4%',
    },
    {
      archivo: 'exclamation-triangle.svg',
      original: '359 bytes',
      optimizado: '335 bytes',
      reduccion: '7%',
    },
    { archivo: 'eye.svg', original: '459 bytes', optimizado: '455 bytes', reduccion: '1%' },
    { archivo: 'eye-off.svg', original: '508 bytes', optimizado: '507 bytes', reduccion: '0%' },
    { archivo: 'lock.svg', original: '351 bytes', optimizado: '352 bytes', reduccion: '0%' },
    {
      archivo: 'shield-check.svg',
      original: '389 bytes',
      optimizado: '387 bytes',
      reduccion: '1%',
    },
    { archivo: 'spinner.svg', original: '198 bytes', optimizado: '195 bytes', reduccion: '2%' },
    { archivo: 'user.svg', original: '327 bytes', optimizado: '327 bytes', reduccion: '0%' },
    {
      archivo: 'x-circle-solid.svg',
      original: '358 bytes',
      optimizado: '350 bytes',
      reduccion: '2%',
    },
  ];
}
