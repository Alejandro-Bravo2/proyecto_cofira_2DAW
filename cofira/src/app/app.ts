import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Header} from './components/layout/header/header';
import {Footer} from './components/layout/footer/footer';
import {NotificationContainer} from './components/shared/notification-container/notification-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, NotificationContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('cofira');
}
