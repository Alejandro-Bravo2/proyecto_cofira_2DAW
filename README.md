# Cofira

**Tu entrenamiento, nutrición y progreso en un solo lugar**

---

## Descripción

**Cofira** es una aplicación web de fitness integral que permite a los usuarios gestionar su entrenamiento, nutrición y seguimiento de progreso desde una única plataforma. Desarrollada como proyecto del ciclo DAW (Desarrollo de Aplicaciones Web), la aplicación está construida con Angular 20 siguiendo las mejores prácticas de arquitectura CSS (ITCSS + BEM) y desarrollo frontend moderno.

---

## Características principales

### Entrenamiento
- Gestión de rutinas de ejercicios
- Calendario de entrenamientos
- Seguimiento de series y repeticiones

### Alimentación
- Planificación de menús diarios
- Control de macronutrientes
- Recetas saludables

### Seguimiento
- Gráficas de progreso
- Registro de medidas corporales
- Histórico de entrenamientos

### Sistema de Diseño
- Design tokens consistentes
- Componentes reutilizables
- Modo oscuro / claro
- Totalmente responsive

---

## Stack tecnológico

### Frontend
- **Angular** 20.3.0
- **TypeScript** 5.9
- **SCSS** con preprocesador
- **RxJS** 7.8 para programación reactiva
- **Karma/Jasmine** 6.4/5.9 para testing

### Arquitectura CSS
El proyecto utiliza una arquitectura CSS moderna basada en:
- **ITCSS** para organización de archivos por especificidad
- **BEM** para nomenclatura de clases CSS
- **CSS Custom Properties** para design tokens y tematización

---

## Instalación

### Requisitos previos

- Node.js >= 18.x
- npm >= 9.x
- Angular CLI >= 20.x

### Pasos

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/proyecto_cofira_2DAW.git

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

## Estructura del proyecto

```
proyecto_cofira_2DAW/
├── cofira/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── layaout/
│   │   │   │   │   ├── header/
│   │   │   │   │   └── footer/
│   │   │   │   └── shared/
│   │   │   │       ├── alert/
│   │   │   │       ├── button/
│   │   │   │       ├── card/
│   │   │   │       ├── form-*/
│   │   │   │       └── notification/
│   │   │   ├── pages/
│   │   │   │   ├── home/
│   │   │   │   ├── gimnasio/
│   │   │   │   ├── alimentacion/
│   │   │   │   ├── seguimiento/
│   │   │   │   └── style-guide/
│   │   │   ├── app.routes.ts
│   │   │   └── app.ts
│   │   ├── styles/              # Arquitectura ITCSS
│   │   │   ├── 00-settings/     # Variables y tokens
│   │   │   ├── 01-tools/        # Mixins y funciones
│   │   │   ├── 02-generic/      # Reset y normalización
│   │   │   ├── 03-elements/     # Estilos base HTML
│   │   │   ├── 04-layout/       # Grid y estructura
│   │   │   ├── 05-components/   # Estilos de componentes
│   │   │   ├── 06-utilities/    # Clases utilitarias
│   │   │   └── 07-dark-mode/    # Tematización oscura
│   │   └── assets/
│   └── package.json
├── docs/
│   ├── design/
│   │   └── DOCUMENTACION.md
│   └── assets/
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

La aplicación está optimizada para distintos dispositivos:

- **640px** (xs) - Mobile grande / Phablets
- **768px** (sm) - Tablets
- **1024px** (md) - Desktop / Tablets landscape
- **1280px** (lg) - Desktop grande

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