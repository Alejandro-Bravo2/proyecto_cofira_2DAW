import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Button } from '../button/button';
import { NotificacionService } from '../../../services/notificacion.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule, Button],
  templateUrl: './form-contact.html',
  styleUrls: ['./form-contact.scss']
})
export class FormContact implements OnInit {
  private fb = inject(FormBuilder);
  private notificacion = inject(NotificacionService);

  formularioContacto!: FormGroup;

  ngOnInit(): void {
    this.formularioContacto = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  alEnviar(): void {
    if (this.formularioContacto.valid) {
      console.log('Formulario enviado:', this.formularioContacto.value);
      this.notificacion.exito('¡Formulario enviado correctamente!');
      this.formularioContacto.reset();
    } else {
      this.formularioContacto.markAllAsTouched();
      this.notificacion.advertencia('Por favor, completa todos los campos correctamente');
    }
  }
}
