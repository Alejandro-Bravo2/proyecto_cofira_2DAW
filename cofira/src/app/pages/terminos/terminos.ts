import {Component, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-terminos',
  standalone: true,
  imports: [],
  templateUrl: './terminos.html',
  styleUrl: './terminos.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Terminos {
  readonly fechaActualizacion = 'Enero 2025';
}
