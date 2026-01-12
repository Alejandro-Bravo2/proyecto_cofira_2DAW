import { Component, ViewEncapsulation } from '@angular/core';

interface TeamMember {
  nombre: string;
  cargo: string;
  foto: string;
  fotoWebp: {
    small: string;
    medium: string;
    large: string;
  };
  linkedin?: string;
}

interface Valor {
  icono: string;
  titulo: string;
  descripcion: string;
}

interface Estadistica {
  valor: string;
  etiqueta: string;
}

@Component({
  selector: 'app-sobre-nosotros',
  standalone: true,
  imports: [],
  templateUrl: './sobre-nosotros.html',
  styleUrl: './sobre-nosotros.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SobreNosotros {
  readonly equipo: TeamMember[] = [
    {
      nombre: 'Alejandro Bravo',
      cargo: 'CEO & Fundador',
      foto: '/assets/images/soyYo.jpg',
      fotoWebp: {
        small: '/assets/images/soyYo-200w.webp',
        medium: '/assets/images/soyYo-400w.webp',
        large: '/assets/images/soyYo-600w.webp',
      },
      linkedin: '#',
    },
  ];

  readonly valores: Valor[] = [
    {
      icono: 'heart',
      titulo: 'Pasión por el Fitness',
      descripcion:
        'Creemos que el ejercicio es medicina y transformamos vidas a través del movimiento.',
    },
    {
      icono: 'users',
      titulo: 'Comunidad',
      descripcion: 'Construimos una comunidad de apoyo donde cada logro se celebra juntos.',
    },
    {
      icono: 'target',
      titulo: 'Resultados',
      descripcion: 'Nos enfocamos en lo que funciona, con planes basados en ciencia y experiencia.',
    },
    {
      icono: 'shield',
      titulo: 'Confianza',
      descripcion: 'Tu privacidad y seguridad son nuestra prioridad. Tus datos están protegidos.',
    },
  ];

  readonly estadisticas: Estadistica[] = [
    { valor: '50K+', etiqueta: 'Usuarios activos' },
    { valor: '1M+', etiqueta: 'Entrenamientos completados' },
    { valor: '500K+', etiqueta: 'Comidas registradas' },
    { valor: '98%', etiqueta: 'Satisfacción' },
  ];
}
