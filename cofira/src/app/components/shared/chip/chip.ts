import {Component, EventEmitter, input, Output} from '@angular/core';

@Component({
  selector: 'app-chip',
  standalone: true,
  templateUrl: './chip.html',
  styleUrl: './chip.scss'
})
export class Chip {
  readonly texto = input.required<string>();
  readonly removible = input<boolean>(false);
  readonly seleccionado = input<boolean>(false);

  @Output() eliminar = new EventEmitter<void>();

  onRemove(): void {
    this.eliminar.emit();
  }
}
