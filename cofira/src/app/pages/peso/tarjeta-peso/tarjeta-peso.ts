import { Component, Input  } from '@angular/core';
import { RegistroPeso } from '../../../models/peso.model';



@Component({
  selector: 'app-tarjeta-peso',
  standalone: true,
  templateUrl: './tarjeta-peso.html',
})

export class TarjetaPeso  {
          @Input() registro! : RegistroPeso;
}