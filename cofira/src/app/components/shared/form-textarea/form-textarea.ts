import {Component, Input, signal} from '@angular/core';
import {FormControl, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-form-textarea',
    imports: [
        ReactiveFormsModule
    ],
  templateUrl: './form-textarea.html',
  styleUrl: './form-textarea.scss',
})

export class FormTextarea {
  @Input({required: true}) label: string = '';
  @Input({required: true}) name: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';
  @Input() autocomplete: string = '';

  @Input() control!: FormControl; // Se pone el ! para indicar que este valor será proporcionado en el padre pero si la quito da error porque necesita inicializarse

  protected readonly inputId = signal("");

  ngOnInit(): void {
    this.inputId.set(`input-${this.name}-${Math.random().toString(36).substr(2, 10)}`);
  }

}



