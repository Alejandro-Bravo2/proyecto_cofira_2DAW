import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-checkbox',
  imports: [ReactiveFormsModule],
  templateUrl: './form-checkbox.html',
  styleUrl: './form-checkbox.scss',
})
export class FormCheckbox {
  @Input({ required: true }) etiqueta: string = '';
  @Input({ required: true }) nombre: string = '';
  @Input() requerido: boolean = false;
  @Input() controlDelFormulario: FormControl = new FormControl(false);
}
