import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { GrasaService } from '../../services/Peso.service';

@Component({
  selector: 'app-peso',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './tarjeta-peso.html',
})
export class Peso {

}
