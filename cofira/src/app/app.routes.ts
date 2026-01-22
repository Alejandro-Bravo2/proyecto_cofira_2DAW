import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Gimnasio } from './pages/gimnasio/gimnasio';
import { Alimentacion } from './pages/alimentacion/alimentacion';
import { Seguimiento } from './pages/seguimiento/seguimiento';
import { StyleGuide } from './pages/style-guide/style-guide';
import { Onboarding } from './pages/onboarding/onboarding';
import { Login } from './pages/login/login';

import { Perfil } from './pages/perfil/perfil';
import { Configuracion } from './pages/configuracion/configuracion';

import { Privacidad } from './pages/privacidad/privacidad';
import { Terminos } from './pages/terminos/terminos';
import { Cookies } from './pages/cookies/cookies';
import { Licencias } from './pages/licencias/licencias';


import { SobreNosotros } from './pages/sobre-nosotros/sobre-nosotros';
import { Blog } from './pages/blog/blog';
import { Contacto } from './pages/contacto/contacto';


import { Pruebas } from './pages/pruebas/pruebas';

export const routes: Routes = [
  
  { path: '', component: Home },
  { path: 'alimentacion', component: Alimentacion },
  { path: 'seguimiento', component: Seguimiento },
  { path: 'gimnasio', component: Gimnasio },
  { path: 'style-guide', component: StyleGuide },
  { path: 'onboarding', component: Onboarding },
  { path: 'login', component: Login },

  { path: 'perfil', component: Perfil },
  { path: 'configuracion', component: Configuracion },


  { path: 'privacidad', component: Privacidad },
  { path: 'terminos', component: Terminos },
  { path: 'cookies', component: Cookies },
  { path: 'licencias', component: Licencias },

  
  { path: 'sobre-nosotros', component: SobreNosotros },
  { path: 'blog', component: Blog },
  { path: 'contacto', component: Contacto },

  
  { path: 'pruebas', component: Pruebas },

  
  { path: '**', redirectTo: '' },
];
