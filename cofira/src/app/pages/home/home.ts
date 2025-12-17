import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormContact } from '../../components/shared/form-contact/form-contact';
import { Card } from '../../components/shared/card/card';
import { FormTextarea } from '../../components/shared/form-textarea/form-textarea';
import { FormSelect } from '../../components/shared/form-select/form-select';
import { FormRegister } from '../../components/shared/form-register/form-register';
import { Alert } from '../../components/shared/alert/alert';
import { Notification } from '../../components/shared/notification/notification';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    FormContact,
    Card,
    FormTextarea,
    FormSelect,
    FormRegister,
    Alert,
    Notification,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  notificaciones: Array<{
    id: number;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  }> = [];
  notifId = 0;

  mostrarNotif() {
    const id = ++this.notifId;
    this.notificaciones.push({
      id,
      type: 'success',
      message: '¡Guardado correctamente!',
    });
  }

  eliminarNotificacion(id: number) {
    this.notificaciones = this.notificaciones.filter((n) => n.id !== id);
  }
}
