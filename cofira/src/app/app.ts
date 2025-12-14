import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Header} from './components/layaout/header/header';
import {Footer} from './components/layaout/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('cofira');
}
