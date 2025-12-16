# Sección 1: Arquitectura CSS y Comunicación Visual

## 1.1 Principios de Comunicación Visual

### 1. Jerarquía: Tamaños, Pesos y Espaciado para Crear Importancia Visual

**Estrategia:**

- **Agrupación de contenido similar:** Uso espaciados reducidos entre elementos relacionados
- **Elementos destacados:** Tamaño mayor y peso de fuente más grueso
- **Colores llamativos:** Para elementos importantes que necesitan resaltar
- **Espaciado generoso:** Alrededor de elementos importantes para aumentar su visibilidad
- **Elementos secundarios:** Tamaño menor, peso de fuente delgado y colores neutros

**Ejemplos de implementación:**

*Botón de acción principal:*

- Color amarillo brillante para máximo contraste
- Jerarquía visual: Botón → Imagen → Título

Ejemplo:
![img.png](../assets/img.png)

*Cabecera de navegación:*

- Colores consistentes en elementos de navegación
- Botón "Inscríbete" en color destacado para llamar la atención

Ejemplo:
![img_1.png](../assets/img_1.png)

*Separación entre secciones:*

- Espaciado amplio entre secciones principales
- Cambio de fondo para delimitar áreas
- Títulos grandes para marcar inicio de nueva sección
- Espaciado y colores consistentes en elementos relacionados (cards de pago)

Ejemplo:
![img_2.png](../assets/img_2.png)

---

### 2. Contraste: Color, Tamaño y Peso para Diferenciar Elementos

**Estrategia:**

- **Colores:** Diferenciación entre elementos importantes (amarillo brillante) y secundarios (neutros)
- **Tamaño y peso:** Mayor tamaño y negrita para títulos y elementos destacados
- **Jerarquía de información:** Títulos principales → Elementos secundarios → Contenido relacionado

**Ejemplos de implementación:**

*Formulario:*

- Coherencia visual en campos de entrada
- Botón "Enviar" en amarillo para destacar la acción principal

Ejemplo:
![img_3.png](../assets/img_3.png)

*Organización de horarios:*

- **Título:** Elemento más grande y con mayor peso
- **Días (Lunes, Miércoles):** Tamaño medio, peso moderado
- **Tabla de horarios:** Mismo tamaño, peso reducido (indica relación entre datos)

![img_4.png](../assets/img_4.png)

---

### 3. Alineación: Estrategia de Organización Visual

**Estrategia:**

- **Alineación centrada:** Como patrón principal para mayor claridad
- **Organización del contenido:** Distribución equilibrada de la información
- **Márgenes adecuados:** Para evitar saturación visual

**Ejemplos de implementación:**

Ejemplos:
![img_5.png](../assets/img_5.png)
![img_6.png](../assets/img_6.png)

---

### 4. Proximidad: Agrupación de Elementos Relacionados

**Estrategia:**

- **Espaciado reducido:** Entre elementos con relación directa
- **Orden visual:** Permite identificar grupos sin necesidad de leer títulos
- **Jerarquía de separación:** Mayor distancia entre categorías principales

**Ejemplos de implementación:**

*Menú diario:*

- Separación mínima entre alimentos de la misma comida
- Mayor separación entre diferentes comidas del día
- Agrupación visual clara sin necesidad de indicadores adicionales

Ejemplo:
![img_7.png](../assets/img_7.png)

---

### 5. Repetición: Creación de Coherencia Visual

**Estrategia:**

- **Consistencia en botones:** Mismos colores, animaciones y tamaños de fuente
- **Estilos uniformes:** Colores, espaciados y tamaños consistentes en secciones similares
- **Iconografía coherente:** Mismo estilo de iconos para acciones relacionadas
- **Familiaridad:** Patrones repetitivos que facilitan la navegación

**Ejemplos de implementación:**
*Páginas de configuración:*

- Colores, espaciados y tamaños consistentes
- Iconos con estilo uniforme para acciones similares

Ejemplos:
![img_8.png](../assets/img_8.png)
![img_10.png](../assets/img_10.png)
![img_9.png](../assets/img_9.png)
![img_11.png](../assets/img_11.png)

### 1.2 Metodología CSS Explica qué metodología usas (BEM recomendado) y por qué. Muestra ejemplos de tu nomenclatura. Si usas BEM, explica que usarás bloques (.card), elementos (.card__title), y modificadores (.card--featured).

He usado la metología BEM porque me permite organizar el código por componentes, además de permitirme reutilizar estilos
en diferentes
partes sin tener problemas de especificidad. El principal mótivo por lo que lo he usado es por la especifidad ya que al
estar trabajando con componentes
muchas veces voy a tener estilos repetidos y con BEM puedo usar los estilos ya creados sin tener que preocuparme por que
se repita esta
clase.

Ejemplos de nomenclatura BEM usada en el proyecto:

```css
.flex__basico {
    display: flex;
    margin: 0 auto;
    padding: 0 var(--spacing-size-xs);
}


.grid__cols__2 {
    grid-template-columns: repeat(2, 1fr);
}

.grid__cols__3 {
    grid-template-columns: repeat(3, 1fr);
}

.grid__cols__4 {
    grid-template-columns: repeat(4, 1fr);
}

.grid__cols__6 {
    grid-template-columns: repeat(6, 1fr);
}

```

### 1.3 Organización de archivos: Documenta tu estructura ITCSS. Explica por qué cada carpeta está en ese orden (de menor a mayor especificidad). Muestra el árbol de carpetas completo.

#### Árbol de carpetas completo

```
styles/
├── 00-settings/
│   └── _variables.scss
├── 01-tools/
│   └── _mixins.scss
├── 02-generic/
│   └── _reset.scss
├── 03-elements/
│   ├── _elements.scss
│   └── _links.scss
├── 04-layout/
│   ├── _grid.scss
│   └── _layaout.scss
├── 05-components/
│   └── _inputs.scss
├── 06-utilities/
│   └── _utilities.scss
├── objects/
│   └── _objetcs.scss
└── utilities/
    └── _utilities.scss
```

### Explicación del orden (de menor a mayor especificidad)

**00-settings/** Variables y configuraciones globales

- **Especificidad:** No tiene ya que es a nivel global.
- **Propósito:** Define variables de colores, tamaños, espaciados, tiempos de animación y tipografías.
- **Ejemplo:** `--radius-xss`, `--spacing-size-xs`

**01-tools/** - Mixins y funciones

- **Especificidad:** No tiene especifidad ya que es a nivel global.
- **Propósito:** Herramientas reutilizables para generar CSS pre hechos.
- **Ejemplo:** Mixins para responsive, flexbox, animaciones...

**02-generic/** - Reset y normalización

- **Especificidad:** No tiene especifidad ya que el funcionamiento de este es para resetear los elementos por defecto.
- **Propósito:** Resetear estilos por defecto del navegador.
- **Ejemplo:** `* { margin: 0; padding: 0; }`

**03-elements/** - Estilos base de elementos HTML en caso de que no le demos estilos.

- **Especificidad:** No tiene especididad.
- **Propósito:** Estilos generales para etiquetas HTML sin clases para darles un estilo base.
- **Ejemplo:** `a`, `h1`, `p`, `button`

**04-layout/** - Estructura y distribución

- **Especificidad:** Si tiene especifidad pero tampoco tanta ya que son clases generales.
- **Propósito:** Grid, flex, contenedores principales su proposito es ser reutilizables para cualquier componente.
- **Ejemplo:** `.grid__cols__2`, `.flex__basico`

**05-components/** - Componentes específicos

- **Especificidad:** Si son específicos ya que son componentes concretos.
- **Propósito:** Estilos de componentes reutilizables
- **Ejemplo:** Inputs, cards, botones

**06-utilities/** (y carpetas `objects/`, `utilities/`)

- **Especificidad:** Muy alta ya que aqui definiremos los componentes de forma individual.
- **Propósito:** Clases de una sola responsabilidad que sobrescriben otros estilos.
- **Ejemplo:** `.text-center`, `.m-2`, `.hidden`

Esta estructura sigue el principio ITCSS de "cascada invertida", donde los estilos van de lo más genérico y reutilizable
a lo más específico y concreto, evitando problemas de especificidad y facilitando el mantenimiento del código.

### 1.4 Sistema de Design Tokens: Documenta todas tus variables. Para cada grupo (colores, tipografía, espaciado, etc.) explica las decisiones:

- Por qué elegiste esos colores
    - Elegí esos colores porque quería usar una paleta que comunicara energía y positividad además de esfuerzo y
      dedicación, por eso usé el amarillo brillante como color principal. Además de que el amarillo es un color que
      llama mucho la atención y es perfecto para botones de llamada a la acción. Los colores neutros los elegí para que
      no compitieran con el amarillo y dejaran que este resaltara más.
  ```css
    /* ============================================
     COLORES - NEGRO
     ============================================ */

  /* Negro - Estados Normal) */
  --negro-normal: #110e10; /* Color secundario */
  --negro-normal-hover: #0f0d0e;
  --negro-normal-active: #0e0b0d;

  /* Negro - Estados Dark */
  --negro-dark: #0d0b0c;
  --negro-dark-hover: #0a080a;
  --negro-dark-active: #080607; /* FONDO */


  /* ============================================
     COLORES - AMARILLO
     ============================================ */

  /* Amarillo - Estados Normal */
  --amarillo-normal: #ffd300; /*  COLOR PRIMARIO */
  --amarillo-normal-hover: #e6be00;
  --amarillo-normal-active: #cca900;

  /* Amarillo - Estados Dark */
  --amarillo-dark: #bf9e00;
  --amarillo-dark-hover: #997f00;
  --amarillo-dark-active: #735f00;


  /* ============================================
     COLORES - BLANCO
     ============================================ */

  /* Blanco - Estados Normal */
  --blanco-normal: #f5f5f5; /* Color secundario // BACKGROUND CARD */
  --blanco-normal-hover: #dddddd; /* FONDO */
  --blanco-normal-active: #c4c4c4; /* Color secundario // BACKGROuND CARD INDIVIDUAL */

  /* Blanco - Estados Dark*/
  --blanco-dark: #b8b8b8;
  --blanco-dark-hover: #939393;
  --blanco-dark-active: #6e6e6e;


  /* ============================================
     COLORES - GRIS
     ============================================ */

  /* Gris - Estados Normal */
  --gris-normal: #3f454c; /* COLOR PRIMARIO DEL DARK MODE */
  --gris-normal-hover: #393e44;
  --gris-normal-active: #32373d; /* BACKGROUND CARD INDIVIDUAL */

  /* Gris - Estados Dark */
  --gris-dark: #2f3439; /* BACKGROUND CARD DARK MODE */
  --gris-dark-hover: #26292e;
  --gris-dark-active: #1c1f22;


  /*Textos*/
  --text-light: #110e10;
  --text-dark: #f5f5f5;

  /*Background gris transparente*/
  --background-light-gray: #3F454C;


  /*Botones*/
  --button-red: #FF3434;
  --button-red-hover: #910505;


  --button-gray: #3f454c;
  --buton-gray-hover: #2f3439;


  --button-yellow: #FFD300;
  --button-yellow-hover: #594A00;


  --button-darker: #32373D;
  --button-darker-hover: #26292E;
  ```
- Por qué esa escala tipográfica
    - Porque es una escala muy ajustable a cualquier diseño que quieras hacer además de que es la más usada en diseño
      web, ya que permite crear jerarquías visuales claras y consistentes.
  ```css
  
  /* Tamaños de la tipografía */
  --font-size-xs: 0.64rem; /* 10.24px */
  --font-size-sm: 0.8rem; /* 12.8px  */
  --font-size-md: 1rem; /* 16px */
  --font-size-lg: 1.25rem; /* 20px */
  --font-size-xl: 1.563rem; /* 25px */
  --font-size-2xl: 1.953rem; /* 31.25px */
  --font-size-3xl: 2.441rem; /* 39px  */
  --font-size-4xl: 3.052rem; /* 48.8px */
  --font-size-5xl: 3.815rem; /* 61px */
  ```
- Por qué esos breakpoints
    - Porque son los más comunes en dispositivos y permiten que el diseño sea responsive en la mayoría de dispositivos.
  ```css
    
    // Mobile Grande / Phablets
    $breakpoint-xs: 640px;
    
    // Tablets
    $breakpoint-s: 768px;
    
    // Desktop / Tablets (Landscape)
    $breakpoint-M: 1024px;
    
    // Desktop Grande
    $breakpoint-L: 1280px;

  ```

### 1.5 Mixins y funciones: Documenta cada mixin que creaste, para qué sirve, y muestra un ejemplo de uso.

Cree estos mixins para facilitar la creación de layouts flexibles y reutilizables en todo el proyecto.

```css
    /
/
Centrado perfecto

(
horizontal y vertical

)
@mixin flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

/
/
Distribuir espacio entre elementos

@mixin flex-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/
/
Flex con wrap

(
cuando los elementos no caben

)
@mixin flex-wrap($gap: 1rem) {
    display: flex;
    flex-wrap: wrap;
    gap: $ gap;
}

/
/
Flex completo

(
ocupa todo el ancho

)
@mixin flex-full {
    display: flex;
    width: 100%;
}

```

Ejemplo de uso:

```css
nav {
    @include flex-full;
    background: var(--gris-normal);
    height: 4.4rem;
    align-items: center;
    box-sizing: border-box;
    justify-content: space-between;
    padding: 0 6rem;
}

```

### 1.6 ViewEncapsulation en Angular: Explica qué estrategia de encapsulación usarás. Angular por defecto usa Emulated (estilos encapsulados por componente). Documenta si mantendrás esto o usarás None (estilos globales). Justifica tu decisión.

He usado la estrategia hibrida emulated, la mayoría de los componentes usa ViewEncapsulation.Emulated para mantener los
estilos encapsulados y evitar conflictos entre componentes. Sin embargo, para los estilos globales y utilidades he
optado por ViewEncapsulation.None para que estos estilos puedan ser aplicados en todo el proyecto sin restricciones.
Esta combinación me permite tener un control preciso sobre los estilos específicos de cada componente mientras mantengo
una base de estilos globales accesible para todos los componentes. Lo he hecho asín para que cada componente pueda tener
sus estilos protegidos sin tener problemas de especifidad, por la escalabilidad ya que de esta forma puedo reutilizar
estilos globales en muchas partes y agilizar el proceso y por que es mucho mas mantenible al tener los estilos globales en un solo lugar.

### 2.1 Elementos semánticos utilizados: Explica qué elementos semánticos usas y cuándo: header, nav, main, article, section, aside, footer. Muestra ejemplos de tu código.

Uso los siguientes elementos:
- header: Lo uso para declarar la cabecera por ejemplo aqui:
```html
<header>
  <img alt="Cofira Logo" class="cabecera__logo" routerLink="/home" src="assets/images/cofiraLogoPng.png">
  <ul class="enlaces">
    <li><a routerLink="/gimnasio">Entrenamiento</a></li>
    <li><a routerLink="/alimentacion">Alimentación</a></li>
    <li><a routerLink="/seguimiento">Seguimiento</a></li>
  </ul>

```
- nav: Lo uso para declarar el menú de navegación, por ejemplo aqui:
```html
  <!-- Sección derecha: Redes sociales -->
  <nav class="footer__right">
    <ul class="footer__social-list">
      
      <li class="footer__social-item">
        <a aria-label="YouTube" class="footer__social" href="https://youtube.com" rel="noopener" target="_blank">
          <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
      </li>

      <li class="footer__social-item">
        <a aria-label="Facebook" class="footer__social" href="https://facebook.com" rel="noopener" target="_blank">
          <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
      </li>

      <li class="footer__social-item">
        <a aria-label="Twitter" class="footer__social" href="https://twitter.com" rel="noopener" target="_blank">
          <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
      </li>

      <li class="footer__social-item">
        <a aria-label="Instagram" class="footer__social" href="https://instagram.com" rel="noopener" target="_blank">
          <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
          </svg>
        </a>
      </li>

      <li class="footer__social-item">
        <a aria-label="LinkedIn" class="footer__social" href="https://linkedin.com" rel="noopener" target="_blank">
          <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </li>

    </ul>
  </nav>
```

- main: El main lo utilizo para indicar el contenido principal de la página web y lo indico unicamente en el index.html ya que luego con el router-outlet indico que ese contenido va a ser reemplazable por los componentes, de esta forma hago que la cabecera y pie de página nunca desaparezca y no tenga que estar usandola por cada página. 
```html
<main class="main-content">
  <router-outlet></router-outlet>
</main>

```

- article: Este elemento lo utilizo para agrupar elementos semanticamente iguales, por ejemplo un grupo de cards o un grupo de enlaces. Por ejemplo un buscador:
```html
  <article class="buscador">
    <svg class="buscador__icono" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5l-1.5 1.5l-5-5v-.79l-.27-.27A6.52 6.52 0 0 1 9.5 16A6.5 6.5 0 0 1 3 9.5A6.5
  6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14S14 12 14 9.5S12 5 9.5 5" fill="currentColor"/>
    </svg>
    <input class="buscador__input" placeholder="¿Que buscas?" type="text">
  </article>
```

- section: El section lo utilizo para cuando agrupar muchos grupos de elementos por ejemplo, un ejemplo podría ser los botones de la cabecera:
```html
<section class="cabecera__botones">


    <button class="boton_inscribete">
      <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
        <path
          d="m77.492 18.457l-17.726 3.127L69.09 74.47a1631 1631 0 0 0-15.8 2.54l-6.503-36.89l-17.726 3.124l6.49 36.795a1878 1878 0 0 0-17.196 3.112l3.292 17.696c5.728-1.066 11.397-2.09 17.028-3.084l7.056 40.02l17.727-3.124l-7.04-39.93q7.956-1.319 15.798-2.54l9.777 55.45l17.727-3.126l-9.697-54.99a1416 1416 0 0 1 25.18-3.38c15.54 46.39 34.697 99.995 66.936 134.448C190.86 250.992 192 268 214.56 310C192 348 176 412 167.21 471l-48 6v15H192c16-48 64-144 64-144s48 96 64 144h72.79v-15l-48-6C336 412 320 348 294 310c26-42 24.175-59.585 35.83-89.377c32.25-34.452 51.42-88.075 66.967-134.478c8.314 1.04 16.697 2.16 25.18 3.38l-9.696 54.99l17.728 3.124l9.777-55.45q7.843 1.221 15.8 2.54l-7.042 39.93l17.727 3.125l7.056-40.02c5.63.993 11.3 2.017 17.028 3.083l3.292-17.696c-5.78-1.075-11.507-2.11-17.195-3.113l6.49-36.796l-17.727-3.125l-6.504 36.89a1565 1565 0 0 0-15.8-2.54l9.324-52.886l-17.726-3.127l-9.406 53.35C365.982 63.31 310.982 59.04 256 59.04c-54.98 0-109.983 4.27-169.102 12.767zM256 76.98c35.53 0 71.07 1.83 107.822 5.463c-14.082 34.858-38.454 73.504-63.203 101.967C290.293 199.27 274.35 209 256 209s-34.294-9.73-44.62-24.59c-24.748-28.463-49.12-67.11-63.202-101.967c36.75-3.633 72.29-5.463 107.822-5.463M256 97c-20.835 0-39 20.24-39 47s18.165 47 39 47s39-20.24 39-47s-18.165-47-39-47"
          fill="currentColor"/>
      </svg>

      <span>Inscribete</span>
    </button>


    <button class="boton__cuenta">

      <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"
          fill="currentColor"/>
      </svg>
      <span>Cuenta</span>
    </button>
  </section>
```


- aside: El aside se utiliza para declarar contenido secundario como menus de navegación a la izquierda o derecha en toda la página, osea como el menú hamburguesa de móvil o los tipicos menús desplegables de filtrado que tienen muchas páginas webs, pero yo no lo he utilizado porque mi web no tiene filtrado o contenido para filtrar.


- footer: El footer se utiliza para indicar el pie de página como el elemento header pero en el pie de página. En el footer declaramos todos los elementos que vamos a tener en el pie de página por ejemplo los iconos, enlaces y los textos que tendremos. Por ejemplo mi footer:
```
<footer class="footer">
  
  <!-- Sección izquierda: Condiciones de uso -->
  <nav class="footer__left">
    <a class="footer__link" routerLink="/condiciones">
      Leer condiciones de uso
    </a>
  </nav>

  <!-- Sección central: Copyright -->
  <p class="footer__copyright">@Copyright - Cofira</p>

  <!-- Sección derecha: Redes sociales -->
  <nav class="footer__right">
    <ul class="footer__social-list">
      
      <li class="footer__social-item">
        <a aria-label="YouTube" class="footer__social" href="https://youtube.com" rel="noopener" target="_blank">
          <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </a>
      </li>

      <li class="footer__social-item">
        <a aria-label="Facebook" class="footer__social" href="https://facebook.com" rel="noopener" target="_blank">
          <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
      </li>

      <li class="footer__social-item">
        <a aria-label="Twitter" class="footer__social" href="https://twitter.com" rel="noopener" target="_blank">
          <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
      </li>

      <li class="footer__social-item">
        <a aria-label="Instagram" class="footer__social" href="https://instagram.com" rel="noopener" target="_blank">
          <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
          </svg>
        </a>
      </li>

      <li class="footer__social-item">
        <a aria-label="LinkedIn" class="footer__social" href="https://linkedin.com" rel="noopener" target="_blank">
          <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </a>
      </li>

    </ul>
  </nav>

</footer>

```

