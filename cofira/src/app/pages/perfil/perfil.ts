import { Component, ViewEncapsulation, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { NotificacionService } from '../../services/notificacion.service';
import { Button } from '../../components/shared/button/button';

interface DatosUsuario {
  nombre: string;
  email: string;
  fechaRegistro: string;
  peso: number | null;
  altura: number | null;
  objetivo: string;
  nivelActividad: string;
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [FormsModule, Button],
  templateUrl: './perfil.html',
  styleUrl: './perfil.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Perfil {
  private readonly authService = inject(AuthService);
  private readonly notificacionService = inject(NotificacionService);

  readonly estaCargando = signal(false);
  readonly modoEdicion = signal(false);

  readonly datosUsuario = signal<DatosUsuario>({
    nombre: "",
    email: "",
    fechaRegistro: "",
    peso: null,
    altura: null,
    objetivo: "Mantener peso",
    nivelActividad: "Moderado",
  });

  readonly objetivos = [
    "Perder peso",
    "Ganar músculo",
    "Mantener peso",
    "Mejorar resistencia",
  ];

  readonly nivelesActividad = [
    "Sedentario",
    "Ligero",
    "Moderado",
    "Activo",
    "Muy activo",
  ];

  readonly imcCalculado = computed(() => {
    const datos = this.datosUsuario();
    if (datos.peso && datos.altura) {
      const alturaEnMetros = datos.altura / 100;
      const imc = datos.peso / (alturaEnMetros * alturaEnMetros);
      return imc.toFixed(1);
    }
    return null;
  });

  readonly estadoImc = computed(() => {
    const imc = this.imcCalculado();
    if (!imc) return null;

    const valorImc = parseFloat(imc);
    if (valorImc < 18.5) return { texto: "Bajo peso", clase: "bajo" };
    if (valorImc < 25) return { texto: "Normal", clase: "normal" };
    if (valorImc < 30) return { texto: "Sobrepeso", clase: "sobrepeso" };
    return { texto: "Obesidad", clase: "obesidad" };
  });

  constructor() {
    this.cargarDatosUsuario();
  }

  private cargarDatosUsuario(): void {
    const usuario = this.authService.currentUser();
    if (usuario) {
      this.datosUsuario.set({
        nombre: usuario.nombre || "",
        email: usuario.email || "",
        fechaRegistro: usuario.fechaRegistro || new Date().toISOString(),
        peso: usuario.peso || null,
        altura: usuario.altura || null,
        objetivo: usuario.objetivo || "Mantener peso",
        nivelActividad: usuario.nivelActividad || "Moderado",
      });
    }
  }

  activarEdicion(): void {
    this.modoEdicion.set(true);
  }

  cancelarEdicion(): void {
    this.modoEdicion.set(false);
    this.cargarDatosUsuario();
  }

  guardarCambios(): void {
    this.estaCargando.set(true);

    setTimeout(() => {
      this.estaCargando.set(false);
      this.modoEdicion.set(false);
      this.notificacionService.exito("Perfil actualizado correctamente");
    }, 1000);
  }

  formatearFecha(fechaIso: string): string {
    if (!fechaIso) return "No disponible";

    const fecha = new Date(fechaIso);
    const opciones: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return fecha.toLocaleDateString("es-ES", opciones);
  }
}
