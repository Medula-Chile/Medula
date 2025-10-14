# TODO: Conectar Agenda del Médico a Base de Datos

## Pendientes
- [ ] Crear función getAppointmentsByDoctor en client/src/services/appointments.js
- [ ] Agregar función getCitasByDoctor en server/controllers/citaController.js
- [ ] Agregar ruta GET /doctor/:doctorId en server/routes/citaRoutes.js
- [ ] Modificar client/src/pages/Doctor/DoctorSchedule.jsx para cargar citas desde BD filtradas por doctor
- [ ] Probar: Crear cita en admin, loguear como doctor, verificar agenda muestra citas
