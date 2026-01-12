# Plan: Refactorizar DIVs por Elementos Semánticos

## Resumen del Análisis

**Buenas noticias:**
- 0 usos de `!important`
- 0 estilos inline (`style=`)

**A refactorizar:**
- ~70 `<div>` que pueden ser elementos semánticos

---

## Archivos a Modificar

### 1. contacto.html (18 divs → 8 cambios)

| Línea | Actual | Nuevo | Razón |
|-------|--------|-------|-------|
| 85-117 | `<div class="contacto__info-lista">` | `<ul>` | Es una lista de información |
| 86 | `<div *ngFor="..." class="contacto__info-item">` | `<li>` | Item de lista |
| 87 | `<div class="contacto__info-icono">` | `<figure>` | Contenedor de icono |
| 110 | `<div class="contacto__info-texto">` | `<address>` | Info de contacto |
| 121 | `<div class="contacto__horarios">` | `<aside>` | Info complementaria |
| 123 | `<div class="contacto__horarios-lista">` | `<dl>` | Lista definición |
| 124 | `<div *ngFor="..." class="contacto__horario">` | Eliminar, usar `<dt>/<dd>` | Par día-hora |
| 140 | `<div *ngFor="..." class="contacto__faq-item">` | `<article>` | Contenido independiente |

### 2. carreras.html (14 divs → 6 cambios)

| Línea | Actual | Nuevo | Razón |
|-------|--------|-------|-------|
| 21 | `<div class="carreras__beneficios-grid">` | `<ul>` | Lista de beneficios |
| 23 | `<div class="carreras__beneficio-icono">` | `<figure>` | Contenedor de icono |
| 71 | `<div class="carreras__posiciones-lista">` | `<ul>` | Lista de posiciones |
| 95 | `<div class="carreras__proceso-pasos">` | `<ol>` | Lista ordenada de pasos |
| 96 | `<div *ngFor="..." class="carreras__paso">` | `<li>` | Paso individual |
| 97 | `<div class="carreras__paso-numero">` | `<span>` o eliminar (usar CSS counter) | Número decorativo |

### 3. blog.html (11 divs → 5 cambios)

| Línea | Actual | Nuevo | Razón |
|-------|--------|-------|-------|
| 34 | `<div class="blog__articulo-imagen">` | `<figure>` | Contenedor de imagen |
| 44 | `<div class="blog__articulo-meta">` | `<footer>` o `<span>` | Metadatos |
| 51 | `<div class="blog__articulo-footer">` | `<footer>` | Pie de artículo |
| 67 | `<div *ngIf="..." class="blog__sin-resultados">` | `<p>` | Mensaje simple |
| 76 | `<div class="blog__newsletter-card">` | `<article>` | Contenido independiente |

### 4. sobre-nosotros.html (16 divs → 8 cambios)

| Línea | Actual | Nuevo | Razón |
|-------|--------|-------|-------|
| 4 | `<div class="about__hero-overlay">` | Eliminar, usar `::before` en CSS | Decorativo |
| 37 | `<div class="about__historia-imagen">` | `<figure>` | Contenedor de imagen |
| 52 | `<div class="about__valores-grid">` | `<ul>` | Lista de valores |
| 54 | `<div class="about__valor-icono">` | `<figure>` | Contenedor de icono |
| 90 | `<div class="about__estadisticas-grid">` | `<ul>` | Lista de stats |
| 91 | `<div *ngFor="..." class="about__estadistica">` | `<li>` | Stat individual |
| 106 | `<div class="about__equipo-grid">` | `<ul>` | Lista de miembros |
| 108 | `<div class="about__miembro-foto">` | `<figure>` | Foto de miembro |

### 5. calendario.html (5 divs → 4 cambios)

| Línea | Actual | Nuevo | Razón |
|-------|--------|-------|-------|
| 7 | `<div class="calendario">` | `<section>` | Sección de calendario |
| 28 | `<div class="calendario__dias-semana">` | `<ul>` | Lista de días |
| 35 | `<div class="calendario__grid">` | `<ul>` | Grid como lista |
| 38 | `<div class="calendario__dia--vacio">` | `<span>` | Placeholder |

### 6. footer.html (2 divs → 1 cambio)

| Línea | Actual | Nuevo | Razón |
|-------|--------|-------|-------|
| 90 | `<div class="footer__controles">` | `<nav>` | Navegación de controles |
| 116 | `<div class="footer__idioma">` | Mantener | Dropdown interactivo (OK como div) |

### 7. ingredientes.html (3 divs → 2 cambios)

| Línea | Actual | Nuevo | Razón |
|-------|--------|-------|-------|
| 8 | `<div class="ingredientes">` | `<section>` | Sección de contenido |
| 11 | `<div class="ingredientes__icono">` | `<figure>` | Contenedor de icono |

### 8. gimnasio.html (1 div → 1 cambio)

| Línea | Actual | Nuevo | Razón |
|-------|--------|-------|-------|
| 164 | `<div class="gimnasio__progreso-panel">` | `<aside>` | Panel lateral |

### 9. modal.html (1 div → 0 cambios)

El `<div class="modal-overlay">` es **correcto** como div porque es un backdrop de accesibilidad sin contenido semántico.

---

## DIVs que se MANTIENEN (son correctos)

Los siguientes divs son **contenedores de layout** sin significado semántico y son correctos:

- `__container` - contenedores de ancho máximo
- `__content` - wrappers de contenido
- `__grid` - layouts de grid (cuando no son listas)
- `__wrapper` - envoltorios de layout
- `__campo` - grupos de campos de formulario

---

## Archivos SCSS a Actualizar

Después de cambiar los elementos HTML, verificar que los selectores SCSS sigan funcionando:

1. `contacto.scss` - actualizar selectores para `<ul>`, `<li>`, `<address>`, `<dl>`, `<dt>`, `<dd>`
2. `carreras.scss` - actualizar selectores para `<ul>`, `<ol>`, `<li>`, `<figure>`
3. `blog.scss` - actualizar selectores para `<figure>`, `<footer>`, `<article>`
4. `sobre-nosotros.scss` - actualizar selectores para `<ul>`, `<li>`, `<figure>`, mover overlay a `::before`
5. `calendario.scss` - actualizar selectores para `<section>`, `<ul>`
6. `footer.scss` - actualizar selector para `<nav>`
7. `ingredientes.scss` - actualizar selectores para `<section>`, `<figure>`
8. `gimnasio.scss` - actualizar selector para `<aside>`

---

## Pasos de Implementación

1. **contacto.html** + `contacto.scss`
2. **carreras.html** + `carreras.scss`
3. **blog.html** + `blog.scss`
4. **sobre-nosotros.html** + `sobre-nosotros.scss`
5. **calendario.html** + `calendario.scss`
6. **footer.html** + `footer.scss`
7. **ingredientes.html** + `ingredientes.scss`
8. **gimnasio.html** + `gimnasio.scss`

---

## Verificación

1. Ejecutar `npm run build` para verificar compilación
2. Revisar cada página visualmente en `localhost:4600`
3. Verificar que los estilos se aplican correctamente
4. Probar funcionalidad de formularios y modales
