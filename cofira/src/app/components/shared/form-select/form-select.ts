import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-select',
  imports: [],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss',
})
export class FormSelect {
  @Input() etiqueta: string = '';
  @Input() nombre: string = '';
  @Input() opciones: string[] = [];
}
