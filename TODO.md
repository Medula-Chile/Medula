# TODO: Implementar Dashboard Administrador

## Backend
- [x] Extender administradorController.js con métodos para gestionar pacientes asignados a médicos (asignar, desasignar)
- [x] Agregar métodos en administradorController.js para crear recetas, citas, ver/editar exámenes
- [x] Actualizar administradorRoutes.js para incluir nuevas rutas protegidas con middleware de rol admin
- [x] Agregar middleware de verificación de rol administrador en las rutas

## Frontend
- [x] Crear AdminShell.jsx para layout del dashboard admin
- [x] Crear AdminDashboard.jsx como página principal del admin
- [x] Crear componentes para gestionar pacientes (lista, asignar/desasignar a médicos)
- [x] Crear componentes para crear recetas, citas, ver/editar exámenes
- [x] Actualizar App.jsx para agregar rutas /admin con subrutas
- [x] Implementar navegación y UI consistente con el resto de la app

## Integración y Testing
- [x] Probar endpoints backend con Postman o similar
- [x] Probar UI frontend y navegación
- [x] Verificar autenticación y control de acceso por rol
- [x] Ajustes finales y corrección de bugs
