import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-privacidad',
  standalone: true,
  imports: [],
  templateUrl: './privacidad.html',
  styleUrl: './privacidad.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Privacidad {
  readonly fechaActualizacion = 'Enero 2025';
}
