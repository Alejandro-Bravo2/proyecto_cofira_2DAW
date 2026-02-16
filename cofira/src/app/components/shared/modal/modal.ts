import {Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Modal implements OnChanges {
  @Input() abierto: boolean = false;
  @Input() titulo: string = '';
  @Input() anchoPX: number = 600;
  @Input() mostrarCerrar: boolean = true;

  @Output() cerrar = new EventEmitter<void>();

  private elementoAnterior: HTMLElement | null = null;

  constructor(private elementRef: ElementRef) {}

  ngOnChanges(cambios: SimpleChanges): void {
    if (cambios["abierto"]) {
      const seAbrio = cambios["abierto"].currentValue;
      const estabaCerrado = !cambios["abierto"].previousValue;

      if (seAbrio && estabaCerrado) {
        this.elementoAnterior = document.activeElement as HTMLElement;
        setTimeout(this.enfocarPrimerElemento.bind(this), 50);
      }

      if (!seAbrio && !estabaCerrado) {
        if (this.elementoAnterior) {
          this.elementoAnterior.focus();
          this.elementoAnterior = null;
        }
      }
    }
  }

  @HostListener('document:keydown.escape')
  cerrarConEscape(): void {
    if (this.abierto) {
      this.cerrarModal();
    }
  }

  @HostListener('document:keydown.tab', ['$event'])
  atraparFoco(evento: Event): void {
    if (!this.abierto) {
      return;
    }

    const eventoTeclado = evento as KeyboardEvent;
    const elementosEnfocables = this.obtenerElementosEnfocables();
    const primerElemento = elementosEnfocables[0];
    const ultimoElemento = elementosEnfocables[elementosEnfocables.length - 1];

    if (eventoTeclado.shiftKey) {
      if (document.activeElement === primerElemento) {
        eventoTeclado.preventDefault();
        ultimoElemento.focus();
      }
    } else {
      if (document.activeElement === ultimoElemento) {
        eventoTeclado.preventDefault();
        primerElemento.focus();
      }
    }
  }

  cerrarModal(): void {
    this.cerrar.emit();
  }

  cerrarEnOverlay(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.cerrarModal();
    }
  }

  private obtenerElementosEnfocables(): HTMLElement[] {
    const selectorElementosEnfocables = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const elementosDelModal = this.elementRef.nativeElement.querySelectorAll(selectorElementosEnfocables);
    return Array.from(elementosDelModal) as HTMLElement[];
  }

  private enfocarPrimerElemento(): void {
    const elementosEnfocables = this.obtenerElementosEnfocables();
    if (elementosEnfocables.length > 0) {
      elementosEnfocables[0].focus();
    }
  }
}
