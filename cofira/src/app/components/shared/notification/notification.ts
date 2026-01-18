import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
})
export class Notification implements OnInit {
  @Input() tipo: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() mensaje: string = '';
  @Input() duracion: number = 3000;
  @Input() puedeCerrarse: boolean = true;
  @Output() alCerrar = new EventEmitter<void>();

  estaCerrando: boolean = false;

  ngOnInit() {
    if (this.duracion > 0) {
      setTimeout(() => {
        this.cerrar();
      }, this.duracion);
    }
  }

  cerrar() {
    this.estaCerrando = true;
    setTimeout(() => {
      this.alCerrar.emit();
    }, 500);
  }
}
