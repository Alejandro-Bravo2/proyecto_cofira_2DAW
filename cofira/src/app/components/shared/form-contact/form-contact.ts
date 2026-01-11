import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../button/button';
import { NotificacionService } from '../../../services/notificacion.service';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COMPONENTE: FormContact
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Formulario de contacto reutilizable con validaciones.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */
@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule, Button],
  templateUrl: './form-contact.html',
  styleUrls: ['./form-contact.scss']
})
export class FormContact implements OnInit {
  // ─────────────────────────────────────────────────────────────────────────
  // INYECCIÓN DE DEPENDENCIAS
  // ─────────────────────────────────────────────────────────────────────────

  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);

  // ─────────────────────────────────────────────────────────────────────────
  // PROPIEDADES
  // ─────────────────────────────────────────────────────────────────────────

  contactForm!: FormGroup;

  // ─────────────────────────────────────────────────────────────────────────
  // CICLO DE VIDA
  // ─────────────────────────────────────────────────────────────────────────

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // ─────────────────────────────────────────────────────────────────────────
  // MÉTODOS
  // ─────────────────────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Formulario enviado:', this.contactForm.value);
      this.notificacion.exito('¡Formulario enviado correctamente!');
      this.contactForm.reset();
    } else {
      this.contactForm.markAllAsTouched();
      this.notificacion.advertencia('Por favor, completa todos los campos correctamente');
    }
  }
}
