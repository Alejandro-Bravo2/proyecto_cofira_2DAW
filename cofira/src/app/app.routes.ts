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
import { AccesoPro } from './pages/acceso-pro/acceso-pro';

import { authGuard, guestGuard } from './guards/auth.guard';
import { proGuard } from './guards/pro.guard';
import { Peso } from './pages/peso/peso';

export const routes: Routes = [

  // Rutas publicas (accesibles sin autenticacion)
  { path: '', component: Home },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'style-guide', component: StyleGuide },

  // Ruta de onboarding (flujo de registro, sin autenticacion)
  { path: 'onboarding', component: Onboarding },

  // Rutas protegidas PRO (requieren autenticacion + suscripcion)
  { path: 'alimentacion', component: Alimentacion, canActivate: [authGuard, proGuard] },
  { path: 'seguimiento', component: Seguimiento, canActivate: [authGuard, proGuard] },
  { path: 'gimnasio', component: Gimnasio, canActivate: [authGuard, proGuard] },
  { path: 'peso', component: Peso, canActivate: [authGuard, proGuard]},

  // Pagina de acceso bloqueado (para usuarios sin PRO)
  { path: 'acceso-pro', component: AccesoPro, canActivate: [authGuard] },
  { path: 'perfil', component: Perfil, canActivate: [authGuard] },
  { path: 'configuracion', component: Configuracion, canActivate: [authGuard] },

  // Rutas legales (publicas)
  { path: 'privacidad', component: Privacidad },
  { path: 'terminos', component: Terminos },
  { path: 'cookies', component: Cookies },
  { path: 'licencias', component: Licencias },

  // Rutas informativas (publicas)
  { path: 'sobre-nosotros', component: SobreNosotros },
  { path: 'blog', component: Blog },
  { path: 'contacto', component: Contacto },

  // Ruta de pruebas (desarrollo)
  { path: 'pruebas', component: Pruebas },

  // Redireccion para rutas no encontradas
  { path: '**', redirectTo: '' },
];
