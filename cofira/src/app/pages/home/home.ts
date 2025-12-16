import {Component} from '@angular/core';
import { FormContact } from '../../components/shared/form-contact/form-contact';
import {Card} from '../../components/shared/card/card';
import {FormTextarea} from '../../components/shared/form-textarea/form-textarea';
import {FormSelect} from '../../components/shared/form-select/form-select';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormContact,
    Card,
    FormTextarea,
    FormSelect
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {

}
