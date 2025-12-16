import {Component, Input, signal} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-form-select',
  imports: [],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss',
})
export class FormSelect {
  @Input({required: true}) label: string = '';
  @Input({required: true}) name: string = '';
  @Input({required: true}) options: string[] = [];

  protected readonly selectId = signal("");

  ngOnInit(): void {
    this.selectId.set(`select-${this.name}`);
  }
}
