import {Component, EventEmitter, Input, input, OnDestroy, Output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, Observable, Subject, switchMap, takeUntil} from 'rxjs';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './autocomplete.html',
  styleUrl: './autocomplete.scss'
})
export class Autocomplete<T extends { id: number | string; nombre: string }> implements OnDestroy {
  readonly placeholder = input<string>('Buscar...');
  readonly caracteresMinimos = input<number>(2);
  @Input() funcionBusqueda!: (consulta: string) => Observable<T[]>;

  @Output() seleccionar = new EventEmitter<T>();

  readonly consulta = signal('');
  readonly resultados = signal<T[]>([]);
  readonly estaAbierto = signal(false);
  readonly estaCargando = signal(false);
  readonly indiceResaltado = signal(-1);

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(textoConsulta => {
        if (textoConsulta.length < this.caracteresMinimos()) {
          this.resultados.set([]);
          this.estaAbierto.set(false);
          return [];
        }
        this.estaCargando.set(true);
        return this.funcionBusqueda(textoConsulta);
      }),
      takeUntil(this.destroy$)
    ).subscribe(listaResultados => {
      this.resultados.set(listaResultados);
      this.estaAbierto.set(listaResultados.length > 0);
      this.estaCargando.set(false);
      this.indiceResaltado.set(-1);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  alCambiarInput(valor: string): void {
    this.consulta.set(valor);
    this.searchSubject.next(valor);
  }

  alSeleccionar(item: T): void {
    this.seleccionar.emit(item);
    this.consulta.set('');
    this.resultados.set([]);
    this.estaAbierto.set(false);
  }

  alPresionarTecla(evento: KeyboardEvent): void {
    const longitudResultados = this.resultados().length;

    switch (evento.key) {
      case 'ArrowDown':
        evento.preventDefault();
        this.indiceResaltado.update(i => Math.min(i + 1, longitudResultados - 1));
        break;
      case 'ArrowUp':
        evento.preventDefault();
        this.indiceResaltado.update(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        evento.preventDefault();
        const indice = this.indiceResaltado();
        if (indice >= 0 && indice < longitudResultados) {
          this.alSeleccionar(this.resultados()[indice]);
        }
        break;
      case 'Escape':
        this.estaAbierto.set(false);
        break;
    }
  }

  alPerderFoco(): void {
    setTimeout(() => {
      this.estaAbierto.set(false);
    }, 200);
  }

  alObtenerFoco(): void {
    if (this.resultados().length > 0) {
      this.estaAbierto.set(true);
    }
  }
}
