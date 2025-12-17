# Formulario de Registro

Este componente proporciona un formulario completo de registro con validaciones.

## Características

✅ **Campos incluidos:**

- Nombre (mínimo 2 caracteres)
- Apellido (mínimo 2 caracteres)
- Email (con validación de formato)
- Contraseña (mínimo 6 caracteres)
- Confirmar Contraseña (validación de coincidencia)
- Checkbox de Términos y Condiciones (requerido)

✅ **Validaciones:**

- Validación en tiempo real
- Mensajes de error específicos
- Validación de coincidencia de contraseñas
- Botón deshabilitado hasta que el formulario sea válido

## Uso

### 1. Importar el componente

```typescript
import { FormRegister } from '../../components/shared/form-register/form-register';

@Component({
  // ...
  imports: [FormRegister],
  // ...
})
```

### 2. Usar en el template

```html
<app-form-register></app-form-register>
```

## Ejemplo en una página

Para agregar el formulario a la página `home`, sigue estos pasos:

### 1. Actualiza `home.ts`:

```typescript
import { Component } from '@angular/core';
import { FormRegister } from '../../components/shared/form-register/form-register';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormRegister],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
```

### 2. Actualiza `home.html`:

```html
<section>
  <h1>Regístrate ahora</h1>
  <app-form-register></app-form-register>
</section>
```

## Personalización

### Modificar los estilos

Los estilos se encuentran en `form-register.scss` y siguen el mismo patrón que el formulario de contacto.

### Modificar las validaciones

Edita el archivo `form-register.ts` en el método `ngOnInit()`:

```typescript
this.registerForm = this.fb.group({
  nombre: ['', [Validators.required, Validators.minLength(2)]],
  // ... más campos
});
```

## Componente de Checkbox

El formulario utiliza el componente `form-checkbox` para los términos y condiciones.

### Propiedades del checkbox:

- `label`: Texto del checkbox
- `name`: Nombre del campo
- `required`: Si es obligatorio (true/false)
- `control`: FormControl vinculado

Puedes personalizar el texto en `form-register.html`:

```html
<app-form-checkbox
  label="Acepto los términos y condiciones"
  name="terminos"
  [required]="true"
  [control]="f['terminos']"
>
</app-form-checkbox>
```

## Eventos

Cuando el formulario se envía correctamente, se ejecuta el método `onSubmit()` que:

1. Muestra los datos en consola
2. Muestra una alerta de confirmación
3. Resetea el formulario

Puedes personalizar este comportamiento editando el método `onSubmit()` en `form-register.ts`.
