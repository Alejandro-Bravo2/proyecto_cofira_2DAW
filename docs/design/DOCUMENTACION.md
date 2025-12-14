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
estilos globales en muchas partes y agilizar el proceso y por que es mucho mas mantenible al tener los estilos globales
en un solo lugar.