import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CampoFormularioBase } from '../base/campo-formulario.base';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMPONENTE: FormTextarea
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Área de texto multilínea reutilizable.
 * Hereda de CampoFormularioBase para evitar duplicación de código.
 *
 * USO:
 * ─────────────────────────────────────────────────────────────────────────────
 * <app-form-textarea
 *   label="Mensaje"
 *   name="mensaje"
 *   placeholder="Escribe tu mensaje..."
 *   [control]="mensajeControl"
 *   [rows]="5"
 * ></app-form-textarea>
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */
@Component({
  selector: 'app-form-textarea',
  imports: [ReactiveFormsModule],
  templateUrl: './form-textarea.html',
  styleUrl: './form-textarea.scss',
})
export class FormTextarea extends CampoFormularioBase {
  // ─────────────────────────────────────────────────────────────────────────
  // INPUTS ESPECÍFICOS DE TEXTAREA
  // ─────────────────────────────────────────────────────────────────────────

  /** Número de filas visibles del textarea */
  @Input() rows: number = 4;

  /** Número máximo de caracteres permitidos */
  @Input() maxLength: number | null = null;
}
