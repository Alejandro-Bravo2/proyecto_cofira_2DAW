import { Input, signal, OnInit, Directive } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive()
export abstract class CampoFormularioBase implements OnInit {
  @Input({ required: true }) etiqueta: string = '';

  @Input({ required: true }) nombre: string = '';

  @Input() placeholder: string = '';

  @Input() requerido: boolean = false;

  @Input() mensajeDeError: string = '';

  @Input() textoDeAyuda: string = '';

  @Input() controlDelFormulario: FormControl = new FormControl('');

  protected readonly inputId = signal('');

  ngOnInit(): void {
    const idAleatorio = Math.random().toString(36).substring(2, 12);
    this.inputId.set(`campo-${this.nombre}-${idAleatorio}`);
  }
}
