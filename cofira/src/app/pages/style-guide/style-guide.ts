import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Header } from '../../components/layout/header/header';
import { Footer } from '../../components/layout/footer/footer';

import { Button } from '../../components/shared/button/button';
import { Card } from '../../components/shared/card/card';
import { Alert } from '../../components/shared/alert/alert';
import { Notification } from '../../components/shared/notification/notification';

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
  nombreControl = new FormControl('');
  emailControl = new FormControl('');
  mensajeControl = new FormControl('');
  passwordControl = new FormControl('');
  checkboxControl = new FormControl(false);

  objetivosOpciones = ['Perder peso', 'Ganar músculo', 'Mantener peso', 'Definir'];
  diasOpciones = ['2 días', '3 días', '4 días', '5 días', '6 días'];

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

  notificaciones: Array<{
    id: number;
    tipo: 'success' | 'error' | 'warning' | 'info';
    mensaje: string;
  }> = [];
  contadorNotificaciones = 0;

  mostrarNotificacion(tipo: 'success' | 'error' | 'warning' | 'info', mensaje: string) {
    const id = ++this.contadorNotificaciones;
    this.notificaciones.push({ id, tipo, mensaje });
  }

  eliminarNotificacion(id: number) {
    this.notificaciones = this.notificaciones.filter((n) => n.id !== id);
  }
}
