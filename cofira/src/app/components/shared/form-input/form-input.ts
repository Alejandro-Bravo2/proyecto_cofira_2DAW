import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CampoFormularioBase } from '../base/campo-formulario.base';

@Component({
  selector: 'app-form-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
})
export class FormInput extends CampoFormularioBase {
  @Input() tipo: string = 'text';

  @Input() autocompletado: string = '';
}
