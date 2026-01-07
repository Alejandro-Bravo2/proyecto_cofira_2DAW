import {Component} from '@angular/core';
import {NgFor} from '@angular/common';
import {FormsModule} from '@angular/forms';

interface FAQ {
  pregunta: string;
  respuesta: string;
}

interface InfoContacto {
  icono: string;
  titulo: string;
  valor: string;
  enlace?: string;
}

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './contacto.html',
  styleUrl: './contacto.scss',
})
export class Contacto {
  formulario = {
    nombre: '',
    email: '',
    asunto: '',
    mensaje: '',
  };

  readonly infoContacto: InfoContacto[] = [
    {
      icono: 'mail',
      titulo: 'Email General',
      valor: 'info@cofira.com',
      enlace: 'mailto:info@cofira.com',
    },
    {
      icono: 'headphones',
      titulo: 'Soporte Técnico',
      valor: 'soporte@cofira.com',
      enlace: 'mailto:soporte@cofira.com',
    },
    {
      icono: 'phone',
      titulo: 'Teléfono',
      valor: '+34 900 123 456',
      enlace: 'tel:+34900123456',
    },
    {
      icono: 'map',
      titulo: 'Dirección',
      valor: 'Calle Fitness 123, 28001 Madrid, España',
    },
  ];

  readonly horarios = [
    {dia: 'Lunes - Viernes', horario: '9:00 - 20:00'},
    {dia: 'Sábados', horario: '10:00 - 14:00'},
    {dia: 'Domingos', horario: 'Cerrado'},
  ];

  readonly faqs: FAQ[] = [
    {
      pregunta: '¿Cómo puedo cancelar mi suscripción?',
      respuesta:
        'Puedes cancelar tu suscripción en cualquier momento desde la sección "Mi cuenta" > "Suscripción". El acceso permanecerá activo hasta el final del período facturado.',
    },
    {
      pregunta: '¿Ofrecen planes personalizados?',
      respuesta:
        'Sí, todos nuestros planes de entrenamiento y nutrición se adaptan a tus objetivos, nivel de experiencia y preferencias alimentarias.',
    },
    {
      pregunta: '¿Puedo usar Cofira sin conexión?',
      respuesta:
        'Sí, puedes descargar tus entrenamientos y planes de comidas para acceder a ellos sin conexión desde nuestra app móvil.',
    },
    {
      pregunta: '¿Tienen garantía de devolución?',
      respuesta:
        'Ofrecemos 30 días de garantía de devolución en todos nuestros planes premium. Si no estás satisfecho, te devolvemos el dinero sin preguntas.',
    },
  ];

  enviarFormulario(): void {
    console.log('Formulario enviado:', this.formulario);
    // Aquí iría la lógica de envío real
    alert('¡Mensaje enviado! Te responderemos pronto.');
    this.formulario = {nombre: '', email: '', asunto: '', mensaje: ''};
  }
}
