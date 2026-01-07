import {Component} from '@angular/core';
import {NgClass, NgFor} from '@angular/common';

interface Articulo {
  id: number;
  titulo: string;
  extracto: string;
  imagen: string;
  categoria: 'nutricion' | 'ejercicio' | 'bienestar';
  categoriaLabel: string;
  fecha: string;
  tiempoLectura: string;
  autor: string;
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [NgFor, NgClass],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog {
  categoriaActiva: string = 'todos';

  readonly categorias = [
    {id: 'todos', label: 'Todos'},
    {id: 'ejercicio', label: 'Ejercicio'},
    {id: 'nutricion', label: 'Nutrición'},
    {id: 'bienestar', label: 'Bienestar'},
  ];

  readonly articulos: Articulo[] = [
    {
      id: 1,
      titulo: '5 Ejercicios Esenciales para Principiantes',
      extracto:
        'Descubre los movimientos fundamentales que todo principiante debería dominar antes de avanzar a rutinas más complejas. Desde sentadillas hasta planchas.',
      imagen: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop',
      categoria: 'ejercicio',
      categoriaLabel: 'Ejercicio',
      fecha: '15 Dic 2024',
      tiempoLectura: '5 min',
      autor: 'Carlos Martínez',
    },
    {
      id: 2,
      titulo: 'Guía Completa de Macronutrientes',
      extracto:
        'Aprende a calcular tus macros de forma precisa. Proteínas, carbohidratos y grasas: cuánto necesitas según tus objetivos de fitness.',
      imagen: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop',
      categoria: 'nutricion',
      categoriaLabel: 'Nutrición',
      fecha: '12 Dic 2024',
      tiempoLectura: '8 min',
      autor: 'Ana Fernández',
    },
    {
      id: 3,
      titulo: 'Cómo Mantener la Motivación a Largo Plazo',
      extracto:
        'La constancia es clave en el fitness. Te compartimos estrategias psicológicas probadas para mantener la motivación incluso en los días difíciles.',
      imagen: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop',
      categoria: 'bienestar',
      categoriaLabel: 'Bienestar',
      fecha: '8 Dic 2024',
      tiempoLectura: '6 min',
      autor: 'Laura García',
    },
    {
      id: 4,
      titulo: 'La Rutina de Calentamiento Perfecta',
      extracto:
        'Un buen calentamiento previene lesiones y mejora el rendimiento. Te enseñamos una rutina completa de 10 minutos para antes de entrenar.',
      imagen: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop',
      categoria: 'ejercicio',
      categoriaLabel: 'Ejercicio',
      fecha: '5 Dic 2024',
      tiempoLectura: '4 min',
      autor: 'Miguel Rodríguez',
    },
    {
      id: 5,
      titulo: 'Alimentos Clave para Ganar Masa Muscular',
      extracto:
        'La alimentación es el 70% de tus resultados. Conoce los alimentos más efectivos para construir músculo de forma natural y saludable.',
      imagen: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=600&h=400&fit=crop',
      categoria: 'nutricion',
      categoriaLabel: 'Nutrición',
      fecha: '1 Dic 2024',
      tiempoLectura: '7 min',
      autor: 'Ana Fernández',
    },
    {
      id: 6,
      titulo: 'Beneficios del Ayuno Intermitente',
      extracto:
        'El ayuno intermitente va más allá de perder peso. Descubre cómo puede mejorar tu energía, claridad mental y salud metabólica.',
      imagen: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&h=400&fit=crop',
      categoria: 'bienestar',
      categoriaLabel: 'Bienestar',
      fecha: '28 Nov 2024',
      tiempoLectura: '9 min',
      autor: 'Laura García',
    },
  ];

  get articulosFiltrados(): Articulo[] {
    if (this.categoriaActiva === 'todos') {
      return this.articulos;
    }
    return this.articulos.filter((a) => a.categoria === this.categoriaActiva);
  }

  filtrarPorCategoria(categoriaId: string): void {
    this.categoriaActiva = categoriaId;
  }
}
