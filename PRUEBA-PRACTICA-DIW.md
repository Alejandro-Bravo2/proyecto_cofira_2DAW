# Alejandro bravo calderón

## Arquitectura: ¿Por qué has colocado tus variables en la capa Settings y tus estilos en Components? 


Las he colococado en la capa de settings porque es el lugar donde se guardan las configuraciones generales que se usan en todo el proyecto.

Los estilos componentes los he guardado en 05-components porque es el sitio que le corresponde a los estilos dedicados a cada componente. En ese directorio he creado tanto el archivo para la tarjetapeso y tanto como para peso (osea ambos componentes).

Las dos variables que he definido son colores bastante distintos a los usados en la página pero 1

## ¿Qué pasaría si importaras Components antes que Settings en el manifiesto?


Pues que las variables no existirían todavía cuando el navegador lea los var() de los componentes, osea que en mi _peso.scss tengo var(--rojo-dark-hover) y si settings no se ha importado antes pues no funcionan y no coge ningun color.




## 2. Metodología: Explica una ventaja real que te haya aportado usar BEM en este examen frente a usar selectores de etiqueta anidados (ej: div > button).


La ventaja de usar bem esque he podido usarlos en los archivos de itcss sin problemas ya que como bem es muy especifico y usa nombres concretos pues no se repite en ningún lado. Si hubiera yo usado alguna otra como la de google pues hubiera sido un lio y me hubiera dado problemas de especifidad.
