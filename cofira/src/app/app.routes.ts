import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Gimnasio } from './pages/gimnasio/gimnasio';
import { Alimentacion } from './pages/alimentacion/alimentacion';
import { Seguimiento } from './pages/seguimiento/seguimiento';
import { StyleGuide } from './pages/style-guide/style-guide';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'alimentacion', component: Alimentacion },
  { path: 'seguimiento', component: Seguimiento },
  { path: 'gimnasio', component: Gimnasio },
  { path: 'style-guide', component: StyleGuide },
  { path: '**', redirectTo: '' }, // 404 redirige a home
];
