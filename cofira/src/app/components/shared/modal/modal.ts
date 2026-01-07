import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Modal {
  @Input() abierto: boolean = false;
  @Input() titulo: string = '';
  @Input() anchoPX: number = 600;
  @Input() mostrarCerrar: boolean = true;

  @Output() cerrar = new EventEmitter<void>();

  cerrarModal(): void {
    this.cerrar.emit();
  }

  cerrarEnOverlay(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cerrarModal();
    }
  }
}
