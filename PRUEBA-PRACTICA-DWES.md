# Alejandro bravo calderón
# Porque he hecho ese endpoint

He hecho ese endpoint porque creo que es útil guarsdar la información del pesaje del usuario ya que de esta forma la aplicación podrá realizar mejores las tablas y recomendaciones de alimentación al usuario. 

Estos son los endpoint que he hecho:
- Get api/registro-peso/hoy -> Obtiene el peso que se haya registrado hoy
- Get api/registro-peso/{fecha} -> Obtiene el pesaje del usuario en una fecha en concreto
- Put api/registro-peso -> Guarda un peso nuevo
- Get api/registro-peso/historial? -> Obtiene el historial de pesos del usuario


He respetado la separación de las capas:
- RegistroPesoController: recibe las peticiones http
- RegistroPesoService: logica de negocio
- RegistroPesoRepository: acceso a la base de datos jpa


# Como he implementado la seguridad
Todos los endpoint están seguros ya que usan @PreAuthorized y eso les obliga a estar autenticados para poder usar dichos endpoint.

# Como probar el endpoint


Como logearte:

curl -X POST http://localhost:8080/api/auth/login -H "Content-Type: application/json" -d '{"email":"tu@email.com","password":"tu_password"}'


Como obtener el registro de pesos:
curl -X PUT http://localhost:8080/api/registro-peso -H "Authorization: Bearer TU_TOKEN" -H "Content-Type: application/json" -d '{"fecha":"FECHA","kilos":74.5}'


Como mirar el historial:
curl -X GET "http://localhost:8080/api/registro-peso/historial?fechaInicio=2026-01-01&fechaFin=2026-02-09" -H "Authorization: Bearer TU_TOKEN"


