import {Component} from '@angular/core';
import {NgFor} from '@angular/common';

interface TeamMember {
  nombre: string;
  cargo: string;
  foto: string;
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
  imports: [NgFor],
  templateUrl: './sobre-nosotros.html',
  styleUrl: './sobre-nosotros.scss',
})
export class SobreNosotros {
  readonly equipo: TeamMember[] = [
    {
      nombre: 'Carlos Martínez',
      cargo: 'CEO & Fundador',
      foto: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face',
      linkedin: '#',
    },
    {
      nombre: 'Laura García',
      cargo: 'Directora de Producto',
      foto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face',
      linkedin: '#',
    },
    {
      nombre: 'Miguel Rodríguez',
      cargo: 'Lead Developer',
      foto: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      linkedin: '#',
    },
    {
      nombre: 'Ana Fernández',
      cargo: 'Nutricionista Jefe',
      foto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
      linkedin: '#',
    },
  ];

  readonly valores: Valor[] = [
    {
      icono: 'heart',
      titulo: 'Pasión por el Fitness',
      descripcion: 'Creemos que el ejercicio es medicina y transformamos vidas a través del movimiento.',
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
    {valor: '50K+', etiqueta: 'Usuarios activos'},
    {valor: '1M+', etiqueta: 'Entrenamientos completados'},
    {valor: '500K+', etiqueta: 'Comidas registradas'},
    {valor: '98%', etiqueta: 'Satisfacción'},
  ];
}
