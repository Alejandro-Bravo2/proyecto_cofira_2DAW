import { Input, signal, OnInit, Directive } from '@angular/core';
import { FormControl } from '@angular/forms';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CLASE BASE: CampoFormularioBase
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Clase base para campos de formulario reutilizables.
 * Contiene la lógica común entre inputs, textareas y otros campos.
 *
 * USO:
 * ─────────────────────────────────────────────────────────────────────────────
 * export class FormInput extends CampoFormularioBase { }
 * export class FormTextarea extends CampoFormularioBase { }
 *
 * INPUTS DISPONIBLES:
 * ─────────────────────────────────────────────────────────────────────────────
 * - label (requerido): Etiqueta del campo
 * - name (requerido): Nombre único del campo
 * - placeholder: Texto de ayuda dentro del campo
 * - required: Si el campo es obligatorio
 * - errorMessage: Mensaje de error personalizado
 * - helpText: Texto de ayuda debajo del campo
 * - control: FormControl para validaciones reactivas
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */
@Directive()
export abstract class CampoFormularioBase implements OnInit {
  // ─────────────────────────────────────────────────────────────────────────
  // INPUTS REQUERIDOS
  // ─────────────────────────────────────────────────────────────────────────

  /** Etiqueta visible del campo */
  @Input({ required: true }) label: string = '';

  /** Nombre único del campo (usado para el atributo name y generación de ID) */
  @Input({ required: true }) name: string = '';

  // ─────────────────────────────────────────────────────────────────────────
  // INPUTS OPCIONALES
  // ─────────────────────────────────────────────────────────────────────────

  /** Texto de placeholder dentro del campo */
  @Input() placeholder: string = '';

  /** Si el campo es obligatorio */
  @Input() required: boolean = false;

  /** Mensaje de error personalizado */
  @Input() errorMessage: string = '';

  /** Texto de ayuda debajo del campo */
  @Input() helpText: string = '';

  /** FormControl para validaciones reactivas */
  @Input() control: FormControl = new FormControl('');

  // ─────────────────────────────────────────────────────────────────────────
  // PROPIEDADES INTERNAS
  // ─────────────────────────────────────────────────────────────────────────

  /** ID único generado para el campo (para accesibilidad label-for) */
  protected readonly inputId = signal('');

  // ─────────────────────────────────────────────────────────────────────────
  // CICLO DE VIDA
  // ─────────────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    // Genera un ID único combinando el nombre + número aleatorio
    // Esto asegura que cada campo tenga un ID único en el DOM
    const idAleatorio = Math.random().toString(36).substring(2, 12);
    this.inputId.set(`campo-${this.name}-${idAleatorio}`);
  }
}
