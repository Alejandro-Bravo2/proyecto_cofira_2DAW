import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-licencias',
  standalone: true,
  imports: [],
  templateUrl: './licencias.html',
  styleUrl: './licencias.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Licencias {
  readonly fechaActualizacion = 'Enero 2025';
}
