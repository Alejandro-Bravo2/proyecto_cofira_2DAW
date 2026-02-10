# Alejandro bravo calderón

# Jerarquía de componentes

He creado dos componentes padre e hijo.

El componente padre es el componente peso y su función es:
- Inyecta a pesoService para recuperar los datos del backend
- Gestiona el estado  con signal 
- Controla el flujo del componente con los if y for
- Registrar los nuevos pesos y cargar el historial


El componente hijo se encarga de: 
- Recibir los datos del compoennte padre y mostrarlos


Interfaces:
- RegistroPeso
- ActualizarPeso


Servicios:
- obtenerPesoHoy() 
- registrarPeso(datos)
- obtenerHistorial(fechaInicio, fechaFin)

Routing:
- ruta añadida en el app.routes.ts para que puedan cargarse los componentes
- Tambien se han agregado las rutas en el header y footer para poder acceder a la nueva página dessde la caebcera y footer.



## Instrucciones de ejecución:
1. Arranca el proyecto con docker-compose -f docker-compose-dev.yml up -d
2. Accede a localhost:4200

