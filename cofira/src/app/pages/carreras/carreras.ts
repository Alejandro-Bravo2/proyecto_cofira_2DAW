import {Component, ViewEncapsulation} from '@angular/core';
import {NgFor, NgIf} from '@angular/common';

interface Beneficio {
  icono: string;
  titulo: string;
  descripcion: string;
}

interface Posicion {
  id: number;
  titulo: string;
  departamento: string;
  ubicacion: string;
  tipo: string;
  descripcion: string;
}

interface PasoSeleccion {
  numero: number;
  titulo: string;
  descripcion: string;
}

@Component({
  selector: 'app-carreras',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './carreras.html',
  styleUrl: './carreras.scss',
  encapsulation: ViewEncapsulation.None,
})
export class Carreras {
  readonly beneficios: Beneficio[] = [
    {
      icono: 'clock',
      titulo: 'Horario Flexible',
      descripcion: 'Trabaja cuando seas más productivo. Ofrecemos flexibilidad horaria real.',
    },
    {
      icono: 'home',
      titulo: 'Trabajo Remoto',
      descripcion: 'Trabaja desde donde quieras. Somos un equipo 100% distribuido.',
    },
    {
      icono: 'heart',
      titulo: 'Salud y Bienestar',
      descripcion: 'Seguro médico completo y acceso gratuito a Cofira Premium.',
    },
    {
      icono: 'book',
      titulo: 'Formación Continua',
      descripcion: 'Presupuesto anual para cursos, conferencias y certificaciones.',
    },
    {
      icono: 'trending',
      titulo: 'Crecimiento',
      descripcion: 'Plan de carrera claro con revisiones salariales semestrales.',
    },
    {
      icono: 'users',
      titulo: 'Equipo Increíble',
      descripcion: 'Trabaja con personas apasionadas por el fitness y la tecnología.',
    },
  ];

  readonly posiciones: Posicion[] = [
    {
      id: 1,
      titulo: 'Senior Frontend Developer',
      departamento: 'Ingeniería',
      ubicacion: 'Remoto (España)',
      tipo: 'Tiempo completo',
      descripcion:
        'Buscamos un/a desarrollador/a frontend con experiencia en Angular para liderar el desarrollo de nuevas funcionalidades.',
    },
    {
      id: 2,
      titulo: 'Product Designer',
      departamento: 'Diseño',
      ubicacion: 'Remoto (Europa)',
      tipo: 'Tiempo completo',
      descripcion:
        'Diseñarás experiencias de usuario excepcionales que ayuden a millones de personas a alcanzar sus objetivos de fitness.',
    },
    {
      id: 3,
      titulo: 'Nutricionista Deportivo',
      departamento: 'Contenido',
      ubicacion: 'Madrid / Remoto',
      tipo: 'Tiempo completo',
      descripcion:
        'Crearás planes nutricionales y contenido educativo para nuestra comunidad de usuarios.',
    },
    {
      id: 4,
      titulo: 'Customer Success Manager',
      departamento: 'Atención al Cliente',
      ubicacion: 'Remoto (España)',
      tipo: 'Tiempo completo',
      descripcion:
        'Serás el punto de contacto principal para nuestros usuarios premium, asegurando su éxito con la plataforma.',
    },
  ];

  readonly pasosSeleccion: PasoSeleccion[] = [
    {
      numero: 1,
      titulo: 'Aplicación',
      descripcion: 'Envía tu CV y cuéntanos por qué te interesa Cofira.',
    },
    {
      numero: 2,
      titulo: 'Entrevista Inicial',
      descripcion: 'Videollamada de 30 min con nuestro equipo de People.',
    },
    {
      numero: 3,
      titulo: 'Prueba Técnica',
      descripcion: 'Un ejercicio práctico relacionado con el puesto.',
    },
    {
      numero: 4,
      titulo: 'Entrevista Final',
      descripcion: 'Conoce al equipo con el que trabajarás.',
    },
  ];
}
