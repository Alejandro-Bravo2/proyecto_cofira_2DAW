import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CampoFormularioBase } from '../base/campo-formulario.base';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMPONENTE: FormInput
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Campo de entrada de texto reutilizable.
 * Hereda de CampoFormularioBase para evitar duplicación de código.
 *
 * USO:
 * ─────────────────────────────────────────────────────────────────────────────
 * <app-form-input
 *   label="Email"
 *   name="email"
 *   type="email"
 *   placeholder="tu@email.com"
 *   [control]="emailControl"
 *   [required]="true"
 * ></app-form-input>
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */
@Component({
  selector: 'app-form-input',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss',
})
export class FormInput extends CampoFormularioBase {
  // ─────────────────────────────────────────────────────────────────────────
  // INPUTS ESPECÍFICOS DE INPUT
  // ─────────────────────────────────────────────────────────────────────────

  /** Tipo de input: text, email, password, number, tel, etc. */
  @Input() type: string = 'text';

  /** Valor para el atributo autocomplete del navegador */
  @Input() autocomplete: string = '';
}
