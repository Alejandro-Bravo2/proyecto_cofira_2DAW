# Alejandro bravo calderón

## Jerarquía de componentes

He creado dos componentes padre e hijo.

### Componente padre: Peso (peso.ts)

Es el componente que lleva la logica. Inyecta PesoService para pedir los datos al backend y gestiona el estado con signals. Controla el flujo de la vista con @if y @for y tiene metodos para registrar peso y cargar el historial.

### Componente hijo: TarjetaPeso (tarjeta-peso.ts)

Su función es recibir un objeto RegistroPeso por @Input() y pinta la fecha y los kilos. No tiene logica ni servicios.

### Interfaces

En peso.model.ts he creado RegistroPeso y ActualizarPeso para tipar los datos del backend.

### Servicio

PesoService tiene metodos para obtener el peso de hoy, registrar un peso nuevo y obtener el historial.

### Routing

He añadido la ruta en app.routes.ts con path 'peso' protegida con authGuard y proGuard. Tambien he puesto los routerLink en el header y footer para navegar a la nueva pagina.


## Instrucciones de ejecución:

1. Arranca el proyecto con docker-compose -f docker-compose-dev.yml up -d
2. Accede a localhost:4200
3. Inicia sesion con un usuario PRO
