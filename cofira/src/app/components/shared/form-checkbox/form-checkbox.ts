import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-checkbox',
  imports: [ReactiveFormsModule],
  templateUrl: './form-checkbox.html',
  styleUrl: './form-checkbox.scss',
})
export class FormCheckbox {
  @Input({ required: true }) label: string = '';
  @Input({ required: true }) name: string = '';
  @Input() required: boolean = false;
  @Input() control: FormControl = new FormControl(false);
}
