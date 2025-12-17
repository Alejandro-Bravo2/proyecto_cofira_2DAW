import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms'; // Importa FormControl

@Component({
  selector: 'app-form-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
})
export class FormInput {
  @Input({ required: true }) label: string = '';
  @Input({ required: true }) name: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';
  @Input() autocomplete: string = '';

  @Input() control: FormControl = new FormControl(''); // Control opcional con valor por defecto

  protected readonly inputId = signal('');

  ngOnInit(): void {
    this.inputId.set(`input-${this.name}-${Math.random().toString(36).substr(2, 10)}`);
  }
}
