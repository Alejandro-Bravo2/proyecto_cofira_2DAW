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
  readonly minChars = input<number>(2);
  @Input() searchFn!: (query: string) => Observable<T[]>;

  @Output() seleccionar = new EventEmitter<T>();

  readonly query = signal('');
  readonly results = signal<T[]>([]);
  readonly isOpen = signal(false);
  readonly isLoading = signal(false);
  readonly highlightedIndex = signal(-1);

  private readonly searchSubject = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (query.length < this.minChars()) {
          this.results.set([]);
          this.isOpen.set(false);
          return [];
        }
        this.isLoading.set(true);
        return this.searchFn(query);
      }),
      takeUntil(this.destroy$)
    ).subscribe(results => {
      this.results.set(results);
      this.isOpen.set(results.length > 0);
      this.isLoading.set(false);
      this.highlightedIndex.set(-1);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onInputChange(value: string): void {
    this.query.set(value);
    this.searchSubject.next(value);
  }

  onSelect(item: T): void {
    this.seleccionar.emit(item);
    this.query.set('');
    this.results.set([]);
    this.isOpen.set(false);
  }

  onKeyDown(event: KeyboardEvent): void {
    const resultsLength = this.results().length;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.highlightedIndex.update(i => Math.min(i + 1, resultsLength - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.highlightedIndex.update(i => Math.max(i - 1, 0));
        break;
      case 'Enter':
        event.preventDefault();
        const index = this.highlightedIndex();
        if (index >= 0 && index < resultsLength) {
          this.onSelect(this.results()[index]);
        }
        break;
      case 'Escape':
        this.isOpen.set(false);
        break;
    }
  }

  onBlur(): void {
    // Delay to allow click events on results
    setTimeout(() => {
      this.isOpen.set(false);
    }, 200);
  }

  onFocus(): void {
    if (this.results().length > 0) {
      this.isOpen.set(true);
    }
  }
}
