import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Gimnasio } from './pages/gimnasio/gimnasio';
import { Alimentacion } from './pages/alimentacion/alimentacion';
import { Seguimiento } from './pages/seguimiento/seguimiento';
import { StyleGuide } from './pages/style-guide/style-guide';
import { Onboarding } from './pages/onboarding/onboarding';
import { Login } from './pages/login/login';

// Páginas legales
import { Privacidad } from './pages/privacidad/privacidad';
import { Terminos } from './pages/terminos/terminos';
import { Cookies } from './pages/cookies/cookies';
import { Licencias } from './pages/licencias/licencias';

// Páginas informativas
import { SobreNosotros } from './pages/sobre-nosotros/sobre-nosotros';
import { Blog } from './pages/blog/blog';
import { Contacto } from './pages/contacto/contacto';

// Páginas de demostración
import { Pruebas } from './pages/pruebas/pruebas';

export const routes: Routes = [
  // Páginas principales
  { path: '', component: Home },
  { path: 'alimentacion', component: Alimentacion },
  { path: 'seguimiento', component: Seguimiento },
  { path: 'gimnasio', component: Gimnasio },
  { path: 'style-guide', component: StyleGuide },
  { path: 'onboarding', component: Onboarding },
  { path: 'login', component: Login },

  // Páginas legales
  { path: 'privacidad', component: Privacidad },
  { path: 'terminos', component: Terminos },
  { path: 'cookies', component: Cookies },
  { path: 'licencias', component: Licencias },

  // Páginas informativas
  { path: 'sobre-nosotros', component: SobreNosotros },
  { path: 'blog', component: Blog },
  { path: 'contacto', component: Contacto },

  // Páginas de demostración
  { path: 'pruebas', component: Pruebas },

  // 404 redirige a home
  { path: '**', redirectTo: '' },
];
