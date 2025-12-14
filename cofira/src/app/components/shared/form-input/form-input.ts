import {Component, Input, signal} from '@angular/core';

@Component({
  selector: 'app-form-input',
  imports: [],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
})
export class FormInput {
  @Input({required: true}) label: string = '';
  @Input({required: true}) name: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() required: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helpText: string = '';
  @Input() autocomplete: string = '';

  protected readonly inputId = signal<string>('');

  ngOnInit(): void {
    this.inputId.set(`input-${this.name}-${Math.random().toString(36).substr(2, 9)}`);
  }
}
