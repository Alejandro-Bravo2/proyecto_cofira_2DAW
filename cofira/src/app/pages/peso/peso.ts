import {Component, inject, OnInit, signal} from "@angular/core";
  import {FormsModule} from "@angular/forms";

  import {PesoService} from "../../services/peso.service";
  import {TarjetaPeso} from "./tarjeta-peso/tarjeta-peso";

  @Component({
    selector: "app-peso",
    standalone: true,
    imports: [FormsModule, TarjetaPeso],
    templateUrl: "./peso.html",
  })
  export class Peso implements OnInit {
    private readonly pesoService = inject(PesoService);

    readonly registroHoy = this.pesoService.registroHoy;
    readonly historialPeso = this.pesoService.historialPeso;
    readonly estaCargando = signal(false);
    readonly valorInput = signal<number | null>(null);
    readonly mensajeExito = signal("");
    readonly mensajeError = signal("");

    ngOnInit(): void {
      this.cargarDatos();
    }

    actualizarValor(evento: Event): void {
      const input = evento.target as HTMLInputElement;
      const valor = input.valueAsNumber;
      this.valorInput.set(isNaN(valor) ? null : valor);
    }

    registrarPeso(): void {
      const valor = this.valorInput();

      if (valor === null || valor < 0 || valor > 500) {
        this.mensajeError.set("Introduce un valor válido entre 0 y 500");
        return;
      }

      this.estaCargando.set(true);
      this.mensajeError.set("");
      this.mensajeExito.set("");

      const fechaHoy = new Date().toISOString().split("T")[0];

      const datosRegistro = {
        fecha: fechaHoy,
        kilos: valor
      };

      this.pesoService.registrarPeso(datosRegistro).subscribe({
        next: () => {
          this.mensajeExito.set("Registro guardado correctamente");
          this.estaCargando.set(false);
          this.cargarHistorial();
        },
        error: () => {
          this.mensajeError.set("Error al guardar el registro");
          this.estaCargando.set(false);
        }
      });
    }

    private cargarDatos(): void {
      this.estaCargando.set(true);

      this.pesoService.obtenerPesoHoy().subscribe({
        next: (registro) => {
          if (registro) {
            this.valorInput.set(registro.kilos);
          }
          this.estaCargando.set(false);
        },
        error: () => {
          this.estaCargando.set(false);
        }
      });

      this.cargarHistorial();
    }

    private cargarHistorial(): void {
      const hoy = new Date();
      const hace30Dias = new Date();
      hace30Dias.setDate(hoy.getDate() - 30);

      const fechaFin = hoy.toISOString().split("T")[0];
      const fechaInicio = hace30Dias.toISOString().split("T")[0];

      this.pesoService.obtenerHistorial(fechaInicio, fechaFin).subscribe({
        error: () => {
          console.error("Error al cargar el historial de peso");
        }
      });
    }
  }