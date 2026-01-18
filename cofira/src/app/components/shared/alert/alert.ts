import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert {
  @Input() tipo: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() mensaje: string = '';
  @Input() puedeCerrarse: boolean = true;

  esVisible: boolean = true;

  cerrar() {
    this.esVisible = false;
  }
}
