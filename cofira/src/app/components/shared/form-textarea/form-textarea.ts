import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CampoFormularioBase } from '../base/campo-formulario.base';

@Component({
  selector: 'app-form-textarea',
  imports: [ReactiveFormsModule],
  templateUrl: './form-textarea.html',
  styleUrl: './form-textarea.scss',
})
export class FormTextarea extends CampoFormularioBase {
  @Input() filas: number = 4;

  @Input() longitudMaxima: number | null = null;
}
