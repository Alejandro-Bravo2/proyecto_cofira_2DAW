import {CommonModule} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-contact.html',
  styleUrls: ['./form-contact.scss']
})
export class FormContact implements OnInit {
  contactForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Formulario enviado:', this.contactForm.value);
      alert('¡Formulario enviado correctamente!');
      this.contactForm.reset();
    } else {
      this.contactForm.markAllAsTouched();
      alert('Por favor, completa todos los campos correctamente');
    }
  }
}
