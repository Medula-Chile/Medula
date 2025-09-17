# Vistas del Paciente (HTML/CSS/JS puros)

Este directorio contiene las vistas del portal del paciente. La **plantilla base** es `pruebasep13vistapacienteresponsive.{html,css,js}`. Las vistas 03 a 09 se generaron copiando la plantilla y ajustando únicamente:

- El `<title>` del documento.
- El `href` del CSS y el `src` del JS para apuntar al archivo de la vista (mismo directorio).
- El contenido específico debe ir en el bloque central (mantener header, sidebar y footer).

## Convenciones
- Archivos por vista: `NN-Nombre.{html,css,js}`
- Mantener el header, sidebar y footer **sin cambios**.
- Editar solo el **bloque de contenido** de cada vista.
- Si deseas resaltar en el sidebar la opción activa, agrega la clase `active` en el enlace correspondiente.

## Mapeo de vistas
- 03-Historial → Mi Historial
- 04-Medicamentos → Mis Medicamentos
- 05-Examenes → Mis Exámenes
- 06-Recetas → Recetas
- 07-Centro → Centros Médicos
- 08-Perfil → Mi Perfil
- 09-Configuracion → Configuración

## Notas
- Las vistas 01 y 02 (Login y Register) no se modifican en este flujo.
- Bootstrap y Font Awesome se cargan vía CDN.
- En cada vista, el CSS/JS específico se encuentra en el mismo directorio que el HTML.
