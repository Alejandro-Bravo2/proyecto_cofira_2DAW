import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
// Layout
import { Header } from '../../components/layaout/header/header';
import { Footer } from '../../components/layaout/footer/footer';
// Shared Components
import { Button } from '../../components/shared/button/button';
import { Card } from '../../components/shared/card/card';
import { Alert } from '../../components/shared/alert/alert';
import { Notification } from '../../components/shared/notification/notification';
// Form Components
import { FormInput } from '../../components/shared/form-input/form-input';
import { FormTextarea } from '../../components/shared/form-textarea/form-textarea';
import { FormSelect } from '../../components/shared/form-select/form-select';
import { FormCheckbox } from '../../components/shared/form-checkbox/form-checkbox';
import { FormContact } from '../../components/shared/form-contact/form-contact';
import { FormLogin } from '../../components/shared/form-login/form-login';
import { FormRegister } from '../../components/shared/form-register/form-register';

@Component({
  selector: 'app-style-guide',
  imports: [
    Header,
    Footer,
    Button,
    Card,
    Alert,
    Notification,
    FormInput,
    FormTextarea,
    FormSelect,
    FormCheckbox,
    FormContact,
    FormLogin,
    FormRegister,
  ],
  templateUrl: './style-guide.html',
  styleUrl: './style-guide.scss',
})
export class StyleGuide {
  // Controles para formularios
  nombreControl = new FormControl('');
  emailControl = new FormControl('');
  mensajeControl = new FormControl('');
  passwordControl = new FormControl('');
  checkboxControl = new FormControl(false);

  // Opciones para select
  objetivosOpciones = ['Perder peso', 'Ganar músculo', 'Mantener peso', 'Definir'];
  diasOpciones = ['2 días', '3 días', '4 días', '5 días', '6 días'];

  // Ventajas para cards
  ventajasMensual = [
    'Máximo de 7 comidas diarias',
    'Rutinas de ejercicios hasta 7 días',
    'Seguimiento avanzado con gráficos',
    'Asesoría nutricional personalizada',
    'Acceso a contenido exclusivo',
  ];

  ventajasAnual = [
    'Todo lo de la cuota mensual',
    'Ahorro del 20% anual',
    'Consultas ilimitadas',
    'Planes personalizados premium',
    'Soporte prioritario 24/7',
  ];

  // Notificaciones
  notificaciones: Array<{
    id: number;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }> = [];
  notifId = 0;

  mostrarNotif(type: 'success' | 'error' | 'warning' | 'info', message: string) {
    const id = ++this.notifId;
    this.notificaciones.push({ id, type, message });
  }

  eliminarNotificacion(id: number) {
    this.notificaciones = this.notificaciones.filter((n) => n.id !== id);
  }
}
