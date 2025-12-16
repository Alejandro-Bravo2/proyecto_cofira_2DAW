import {Component} from '@angular/core';
import { FormContact } from '../../components/shared/form-contact/form-contact';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormContact
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
