import api from './api';

// Servicio para manejar operaciones relacionadas con pacientes

export const patientsService = {
    // Obtener datos del paciente actual
    getCurrentPatient: async () => {
        const response = await api.get('/pacientes/me');
        return response.data;
    },

    // Actualizar datos del paciente
    updatePatient: async (patientData) => {
        const response = await api.put('/pacientes/me', patientData);
        return response.data;
    },

    // Obtener historial médico del paciente
    getPatientHistory: async () => {
        const response = await api.get('/historial/me');
        return response.data;
    },

    // Crear un resumen del paciente basado en su perfil y historial
    getPatientSummary: async () => {
        try {
            const [patientData, historyData] = await Promise.all([
                patientsService.getCurrentPatient(),
                patientsService.getPatientHistory()
            ]);

            // Crear resumen combinado
            const summary = {
                perfil: {
                    nombre: patientData.usuario_id.nombre,
                    rut: patientData.usuario_id.rut,
                    email: patientData.usuario_id.email,
                    fecha_nacimiento: patientData.fecha_nacimiento,
                    sexo: patientData.sexo,
                    telefono: patientData.telefono,
                    direccion: patientData.direccion,
                    prevision: patientData.prevision,
                    alergias: patientData.alergias,
                    enfermedades_cronicas: patientData.enfermedades_cronicas
                },
                historial: historyData.map(record => ({
                    fecha: record.fecha,
                    profesional: record.profesional_id.nombre,
                    diagnostico: record.diagnostico,
                    tratamiento: record.tratamiento,
                    medicamentos: record.medicamentos,
                    notas: record.notas
                })),
                estadisticas: {
                    totalConsultas: historyData.length,
                    ultimaConsulta: historyData.length > 0 ? historyData[0].fecha : null,
                    medicosAtendidos: [...new Set(historyData.map(h => h.profesional_id.nombre))].length
                }
            };

            return summary;
        } catch (error) {
            throw new Error('Error al obtener el resumen del paciente: ' + error.message);
        }
    }
};

export default patientsService;
