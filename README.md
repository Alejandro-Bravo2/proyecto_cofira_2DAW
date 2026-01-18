# Cofira

**Tu entrenamiento, nutrición y progreso en un solo lugar**

![Angular](https://img.shields.io/badge/Angular-20.3.0-DD0031?style=flat&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-BEM-CC6699?style=flat&logo=sass&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## URL de producción

**Aplicación desplegada:** [https://cofira.app](https://cofira.app)

La aplicación está desplegada en un VPS y es totalmente funcional. Puedes probar todas las funcionalidades, el sistema de temas claro/oscuro, el onboarding completo y navegación responsive.

---

## Descripción

**Cofira** es una aplicación web de fitness integral que permite a los usuarios gestionar su entrenamiento, nutrición y seguimiento de progreso desde una única plataforma. Desarrollada como proyecto del ciclo DAW (Desarrollo de Aplicaciones Web), la aplicación está construida con Angular 20 siguiendo las mejores prácticas de arquitectura CSS (ITCSS + BEM) y desarrollo frontend moderno.

---

## Características principales

### Entrenamiento
- Gestión de rutinas de ejercicios personalizadas
- Catálogo de ejercicios por grupos musculares
- Calendario de entrenamientos
- Seguimiento de series, repeticiones y peso

###  Alimentación
- Planificación de menús diarios
- Control de macronutrientes (proteínas, carbohidratos, grasas)
- Recetas saludables con información nutricional
- Cálculo automático de calorías según objetivos

###  Seguimiento
- Gráficas de progreso visual
- Registro de medidas corporales
- Histórico completo de entrenamientos y comidas
- Estadísticas de progreso

###  Sistema de Diseño
- **15 páginas** completamente responsive (home, gimnasio, alimentación, seguimiento, onboarding, login, blog, contacto, sobre-nosotros, etc.)
- **19 componentes reutilizables** (buttons, alerts, modals, forms, notifications, etc.)
- **+500 CSS Custom Properties** para tematización completa
- **Sistema de temas** claro/oscuro con:
  - Detección automática de preferencia del sistema (`prefers-color-scheme`)
  - Persistencia en localStorage
  - Theme switcher visible en header
  - Transiciones suaves (200ms)
- **Arquitectura ITCSS + BEM** con nombres descriptivos
- **11 animaciones CSS** optimizadas (solo `transform` y `opacity`)
- **Imágenes WebP** optimizadas con múltiples tamaños responsive

###  Autenticación y Onboarding
- Login con validación en tiempo real
- Registro de usuarios con onboarding personalizado de 14 pasos
- Persistencia de sesión con localStorage
- Cálculo personalizado de calorías según perfil, objetivos y nivel de actividad del usuario

---

## Stack tecnológico

### Frontend
- **Angular** 20.3.0 
- **TypeScript** 5.9
- **SCSS** con preprocesador
- **RxJS** 7.8 para programación reactiva
- **Karma/Jasmine** 6.4/5.9 para testing

### Backend
- **Spring Boot** 3.0
- **Kotlin/Java** para la lógica de negocio
- **PostgreSQL** para base de datos
- **JWT** para autenticación
- **REST API** con arquitectura en capas

### Arquitectura CSS
El proyecto utiliza una arquitectura CSS moderna basada en:
- **ITCSS** (7 capas) para organización de archivos por especificidad
- **BEM** para nomenclatura de clases CSS con selectores 100% planos
- **CSS Custom Properties** para design tokens y tematización (+500 variables)
- **Mixins reutilizables** para estados interactivos (`hover-activo`, `click-activo`, `focus-activo`)
- **Sin anidación de selectores** (100% selectores planos)

---

## Instalación

### Requisitos previos

- Node.js >= 18.x
- npm >= 9.x
- Angular CLI >= 20.x

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/Alejandro-Bravo2/proyecto_cofira_2DAW.git

# Entrar al directorio
cd proyecto_cofira_2DAW/cofira

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

La aplicación estará disponible en `http://localhost:4200`

### Comandos disponibles

```bash
npm start         
npm run build   
npm run watch   
npm test        
```

---

## Sistema de diseño

### Paleta de colores

El proyecto utiliza una paleta reducida y consistente:

- **Amarillo** (`#FFD300`) - Color primario, usado en CTAs y elementos destacados
- **Negro** (`#110E10`) - Textos y fondos oscuros
- **Blanco** (`#F5F5F5`) - Fondos claros
- **Gris** (`#3F454C`) - Elementos secundarios

### Tipografía

- **Montserrat** - Tipografía principal para textos generales
- **Poppins** - Tipografía para títulos y encabezados

### Componentes

La aplicación cuenta con un sistema de componentes reutilizables:

**Botones**
- `<app-button>` con variantes: primary, secondary, ghost, danger

**Tarjetas**
- `<app-card>` con variantes: planes, info

**Alertas y notificaciones**
- `<app-alert>` para mensajes persistentes
- `<app-notification>` para mensajes temporales
- Variantes: success, error, warning, info

**Formularios**
- `<app-form-input>` - Campos de entrada
- `<app-form-select>` - Selectores desplegables
- `<app-form-textarea>` - Áreas de texto
- `<app-form-checkbox>` - Casillas de verificación

---

## Documentación

La documentación técnica completa está disponible en `docs/design/DOCUMENTACION.md` e incluye:

- Principios de comunicación visual
- Metodología BEM con ejemplos prácticos
- Arquitectura ITCSS detallada
- Sistema de Design Tokens
- Documentación de componentes
- Capturas del Style Guide

### Style Guide interactivo

La aplicación incluye una página de Style Guide accesible en `/style-guide` que muestra todos los design tokens, componentes con sus variantes y ejemplos de uso.


---

## Testing

```bash
# Ejecutar tests
npm test

# Tests con coverage
npm test -- --code-coverage
```

---

## Responsive

La aplicación está completamente optimizada para todos los dispositivos y probada en múltiples viewports:

- **320px** - iPhone SE (1ª gen)
- **375px** - iPhone 12/13/14 (viewport más común)
- **640px** (xs) - Mobile grande / Phablets
- **768px** (sm) - Tablets verticales
- **900px** - Tablets landscape
- **1024px** (md) - Desktop / Tablets landscape
- **1280px** (lg) - Desktop grande

**Estrategia:** Desktop-first con media queries `max-width` usando el mixin `responsive-down()`

## Páginas implementadas

La aplicación cuenta con **15 páginas** completamente funcionales:

**Páginas principales:**
- Home, Gimnasio, Alimentación, Seguimiento, Login, Onboarding (14 steps)

**Páginas informativas:**
- Sobre nosotros, Blog, Contacto

**Páginas legales:**
- Privacidad, Cookies, Términos, Licencias

**Utilidades:**
- Style Guide, Pruebas (testing de SVG optimizados)

---

## Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo LICENSE para más detalles.
