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

export const routes: Routes = [

  { path: '', component: Home, title: 'Cofira - Nutricion y Entrenamiento' },
  { path: 'login', component: Login, canActivate: [guestGuard], title: 'Iniciar Sesion - Cofira' },
  { path: 'style-guide', component: StyleGuide, title: 'Guia de Estilos - Cofira' },

  { path: 'onboarding', component: Onboarding, title: 'Registro - Cofira' },

  { path: 'alimentacion', component: Alimentacion, canActivate: [authGuard, proGuard], title: 'Alimentacion - Cofira' },
  { path: 'seguimiento', component: Seguimiento, canActivate: [authGuard, proGuard], title: 'Seguimiento - Cofira' },
  { path: 'gimnasio', component: Gimnasio, canActivate: [authGuard, proGuard], title: 'Gimnasio - Cofira' },

  { path: 'acceso-pro', component: AccesoPro, canActivate: [authGuard], title: 'Cofira PRO - Cofira' },
  { path: 'perfil', component: Perfil, canActivate: [authGuard], title: 'Mi Perfil - Cofira' },
  { path: 'configuracion', component: Configuracion, canActivate: [authGuard], title: 'Configuracion - Cofira' },

  { path: 'privacidad', component: Privacidad, title: 'Politica de Privacidad - Cofira' },
  { path: 'terminos', component: Terminos, title: 'Terminos de Servicio - Cofira' },
  { path: 'cookies', component: Cookies, title: 'Politica de Cookies - Cofira' },
  { path: 'licencias', component: Licencias, title: 'Licencias - Cofira' },

  { path: 'sobre-nosotros', component: SobreNosotros, title: 'Sobre Nosotros - Cofira' },
  { path: 'blog', component: Blog, title: 'Blog - Cofira' },
  { path: 'contacto', component: Contacto, title: 'Contacto - Cofira' },

  { path: 'pruebas', component: Pruebas, title: 'Pruebas - Cofira' },

  { path: '**', redirectTo: '' },
];
