import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class Notification implements OnInit {
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() message: string = '';
  @Input() duration: number = 3000; // 3 segundos por defecto
  @Input() closable: boolean = true;
  @Output() onClose = new EventEmitter<void>();

  closing: boolean = false;

  ngOnInit() {
    // Auto-cerrar después del duration
    if (this.duration > 0) {
      setTimeout(() => {
        this.close();
      }, this.duration);
    }
  }

  close() {
    this.closing = true;
    // Esperar a que termine la animación de salida antes de emitir el evento
    setTimeout(() => {
      this.onClose.emit();
    }, 500); // Tiempo de la animación
  }
}
