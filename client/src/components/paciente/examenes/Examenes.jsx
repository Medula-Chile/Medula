import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';

const MisExamenes = () => {
    const { user, loading: authLoading } = useAuth();
    const [examenes, setExamenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Obtener el pacienteId del usuario autenticado
    // Primero intentar obtener desde el perfil de paciente
    const [pacienteId, setPacienteId] = useState(null);
    const [pacienteIdLoading, setPacienteIdLoading] = useState(true);

    // Resolver pacienteId desde el usuario autenticado
    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            setPacienteIdLoading(false);
            return;
        }
        
        const fetchPacienteId = async () => {
            try {
                setPacienteIdLoading(true);
                // Si el usuario ya tiene pacienteId directo
                if (user.pacienteId) {
                    setPacienteId(user.pacienteId);
                    setPacienteIdLoading(false);
                    return;
                }
                
                // Buscar el paciente por usuario_id
                const userId = user.id || user._id;
                if (!userId) {
                    setPacienteIdLoading(false);
                    return;
                }
                
                const resp = await axios.get('http://localhost:5000/api/pacientes');
                const pacientes = Array.isArray(resp.data.pacientes) ? resp.data.pacientes : (Array.isArray(resp.data) ? resp.data : []);
                const paciente = pacientes.find(p => 
                    String(p.usuario_id?._id || p.usuario_id) === String(userId)
                );
                
                if (paciente) {
                    setPacienteId(paciente._id);
                } else {
                    console.warn('No se encontró paciente para el usuario');
                }
            } catch (err) {
                console.error('Error obteniendo pacienteId:', err);
            } finally {
                setPacienteIdLoading(false);
            }
        };
        
        fetchPacienteId();
    }, [user, authLoading]);

    // Cargar exámenes cuando el usuario esté autenticado
    useEffect(() => {
        if (authLoading || pacienteIdLoading) {
            setLoading(true);
            return;
        }

        const fetchExamenes = async () => {
            if (!pacienteId) {
                // Solo mostrar error si ya terminó de cargar y no hay pacienteId
                if (!pacienteIdLoading) {
                    setError('No se ha identificado al paciente. Por favor, inicie sesión nuevamente.');
                }
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                // Usar el endpoint correcto con query param
                const response = await axios.get('http://localhost:5000/api/examenes', {
                    params: { paciente: pacienteId }
                });
                const data = Array.isArray(response.data) ? response.data : [];
                setExamenes(data);
            } catch (err) {
                if (err.response?.status === 404) {
                    setError('No se encontraron exámenes para este paciente');
                } else {
                    setError('Error al cargar los exámenes');
                }
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchExamenes();
    }, [pacienteId, authLoading, pacienteIdLoading]);

    const solicitarDescargable = async (examenId, archivoAdjunto, tipoExamen) => {
        try {
            if (!archivoAdjunto) {
                alert('No hay archivo disponible para descargar');
                return;
            }

            const response = await axios.get(`http://localhost:5000${archivoAdjunto}`, {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            
            const fileName = archivoAdjunto.split('/').pop() || `examen_${tipoExamen.replace(/\s+/g, '_')}.pdf`;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
        } catch (err) {
            console.error('Error al descargar:', err);
            if (err.response?.status === 404) {
                alert('El archivo no se encuentra disponible en el servidor');
            } else {
                alert('Error al descargar el examen');
            }
        }
    };

    const verExamen = (archivoAdjunto) => {
        if (!archivoAdjunto) {
            alert('No hay archivo disponible para visualizar');
            return;
        }
        
        window.open(`http://localhost:5000${archivoAdjunto}`, '_blank');
    };

    // Función para formatear fecha
    const formatFecha = (fecha) => {
        if (!fecha) return 'No programada';
        return new Date(fecha).toLocaleDateString('es-CL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    // Función para obtener el icono según el tipo de examen - CON OPCIONES PREDEFINIDAS
    const getExamenIcon = (tipoExamen) => {
        const iconStyles = {
            // Exámenes de sangre
            'Hemograma completo': 'text-danger',
            'Bioquímica sanguínea': 'text-danger',
            'Perfil lipídico': 'text-danger',
            'Glucosa en sangre': 'text-danger',
            
            // Análisis de laboratorio
            'Uroanálisis': 'text-info',
            'Coprocultivo': 'text-info',
            'Prueba de embarazo': 'text-info',
            'Test de COVID-19': 'text-info',
            
            // Imágenes médicas
            'Radiografía de tórax': 'text-warning',
            'Ecografía abdominal': 'text-warning',
            'Tomografía computarizada': 'text-warning',
            'Resonancia magnética': 'text-warning',
            'Mamografía': 'text-warning',
            'Densitometría ósea': 'text-warning',
            
            // Estudios cardíacos
            'Electrocardiograma': 'text-success',
            'Prueba de esfuerzo': 'text-success',
            
            // Estudios respiratorios
            'Espirometría': 'text-primary',
            
            // Endoscopias
            'Endoscopia digestiva': 'text-secondary',
            'Colonoscopia': 'text-secondary',
            
            // Por defecto
            'Otro': 'text-dark'
        };

        return iconStyles[tipoExamen] || 'text-primary';
    };

    // Función para obtener icono SVG según el tipo de examen
    const getExamenSvgIcon = (tipoExamen) => {
        const iconPaths = {
            // Sangre
            'Hemograma completo': 'M12,2C6.5,2,2,6.5,2,12C2,17.5,6.5,22,12,22C17.5,22,22,17.5,22,12C22,6.5,17.5,2,12,2M14,17H10V15H14V14H10V12H14V7H7V17H14Z',
            'Bioquímica sanguínea': 'M12,2C6.5,2,2,6.5,2,12C2,17.5,6.5,22,12,22C17.5,22,22,17.5,22,12C22,6.5,17.5,2,12,2M14,17H10V15H14V14H10V12H14V7H7V17H14Z',
            'Perfil lipídico': 'M12,2C6.5,2,2,6.5,2,12C2,17.5,6.5,22,12,22C17.5,22,22,17.5,22,12C22,6.5,17.5,2,12,2M14,17H10V15H14V14H10V12H14V7H7V17H14Z',
            'Glucosa en sangre': 'M12,2C6.5,2,2,6.5,2,12C2,17.5,6.5,22,12,22C17.5,22,22,17.5,22,12C22,6.5,17.5,2,12,2M14,17H10V15H14V14H10V12H14V7H7V17H14Z',
            
            // Imágenes
            'Radiografía de tórax': 'M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z',
            'Ecografía abdominal': 'M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z',
            'Tomografía computarizada': 'M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z',
            'Resonancia magnética': 'M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z',
            
            // Por defecto
            'default': 'M12,2C6.5,2,2,6.5,2,12C2,17.5,6.5,22,12,22C17.5,22,22,17.5,22,12C22,6.5,17.5,2,12,2M14,17H10V15H14V14H10V12H14V7H7V17H14Z'
        };

        return iconPaths[tipoExamen] || iconPaths.default;
    };

    // Función para determinar si el examen está disponible para ver/descargar
    const isExamenDisponible = (examen) => {
        return examen.estado === 'entregado' && examen.archivo_adjunto;
    };

    // Función para obtener el texto del estado
    const getEstadoTexto = (estado) => {
        const estados = {
            'solicitado': { 
                texto: 'Solicitado', 
                clase: 'bg-secondary',
                descripcion: 'Examen solicitado, pendiente de realización'
            },
            'realizado': { 
                texto: 'Realizado', 
                clase: 'bg-info',
                descripcion: 'Examen realizado, pendiente de análisis'
            },
            'analizado': { 
                texto: 'Analizado', 
                clase: 'bg-warning text-dark',
                descripcion: 'Examen analizado, pendiente de entrega'
            },
            'entregado': { 
                texto: 'Entregado', 
                clase: 'bg-success',
                descripcion: 'Examen entregado, disponible para ver y descargar'
            }
        };
        return estados[estado] || { texto: estado, clase: 'bg-secondary', descripcion: '' };
    };

    // Función para obtener el nombre del médico
    const getNombreMedico = (medicoData) => {
        if (!medicoData) return 'No asignado';
        return medicoData.usuario_id?.nombre || medicoData.nombre || 'Médico';
    };

    // Función para obtener especialidad del médico
    const getEspecialidadMedico = (medicoData) => {
        if (!medicoData) return '';
        return medicoData.especialidad || '';
    };

    // Función para determinar el tipo de archivo
    const getTipoArchivo = (archivoAdjunto) => {
        if (!archivoAdjunto) return '';
        const extension = archivoAdjunto.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'dicom'].includes(extension)) {
            return 'imagen';
        }
        return 'documento';
    };

    // Función para obtener texto del botón según tipo de archivo
    const getTextoBotonDescarga = (tipoArchivo) => {
        return tipoArchivo === 'imagen' ? 'Descargar Imágenes' : 'Descargar PDF';
    };

    // Función para obtener icono según tipo de archivo
    const getIconoArchivo = (tipoArchivo) => {
        return tipoArchivo === 'imagen' ? 'fa-image' : 'fa-file-pdf';
    };

    // Función para obtener mensaje según el estado
    const getMensajeEstado = (estado) => {
        const mensajes = {
            'solicitado': 'Este examen ha sido solicitado. Espera a que sea realizado.',
            'realizado': 'El examen ha sido realizado. Está en proceso de análisis.',
            'analizado': 'El examen ha sido analizado. Pronto estará disponible.',
            'entregado': 'El examen está disponible para ver y descargar.'
        };
        return mensajes[estado] || 'Estado del examen no definido.';
    };

    // Contar exámenes por estado
    const contarExamenesPorEstado = () => {
        const conteo = {
            solicitado: 0,
            realizado: 0,
            analizado: 0,
            entregado: 0,
            total: examenes.length
        };

        examenes.forEach(examen => {
            if (conteo.hasOwnProperty(examen.estado)) {
                conteo[examen.estado]++;
            }
        });

        return conteo;
    };

    const estadisticas = contarExamenesPorEstado();

    // Estado: Cargando autenticación
    if (authLoading) {
        return (
            <div className="container-fluid">
                <div className="card">
                    <div className="card-body d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
                        <div className="text-center">
                            <div className="spinner-border text-primary mb-3" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p>Verificando autenticación...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Estado: No autenticado
    if (!user) {
        return (
            <div className="container-fluid">
                <div className="card">
                    <div className="card-body">
                        <div className="alert alert-warning text-center" role="alert">
                            <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
                            <h5>Acceso no autorizado</h5>
                            <p>Por favor, inicie sesión para ver sus exámenes</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="container-fluid">
                <div className="card">
                    <div className="card-body d-flex justify-content-center align-items-center" style={{minHeight: '400px'}}>
                        <div className="text-center">
                            <div className="spinner-border text-primary mb-3" role="status">
                                <span className="visually-hidden">Cargando...</span>
                            </div>
                            <p>Cargando sus exámenes...</p>
                            <small className="text-muted">Usuario: {user.nombre || user.email}</small>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container-fluid">
                <div className="card">
                    <div className="card-body">
                        <div className="alert alert-danger" role="alert">
                            <i className="fas fa-exclamation-triangle me-2"></i>
                            {error}
                            <div className="mt-2">
                                <small>
                                    Usuario: {user.nombre || user.email} 
                                </small>
                            </div>
                            <button 
                                className="btn btn-outline-primary btn-sm mt-2"
                                onClick={() => window.location.reload()}
                            >
                                <i className="fas fa-redo me-1"></i>
                                Reintentar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid">
            <div className="card">
                        <div className="card-header bg-white pb-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 className="card-title mb-0">Mis Exámenes</h5>
                                    <p className="text-muted small mb-0">
                                        {estadisticas.total} examen(es) en tu historial
                                    </p>
                                </div>
                                <div className="text-end">
                                    <small className="text-muted">
                                        <i className="fas fa-user me-1"></i>
                                        {user.nombre || user.email}
                                    </small>
                                </div>
                            </div>
                            
                            {/* Estadísticas de estados */}
                            {estadisticas.total > 0 && (
                                <div className="row mt-3 g-2">
                                    <div className="col-6 col-md-3">
                                        <div className="text-center p-2 bg-light rounded">
                                            <div className="text-secondary fw-bold">{estadisticas.solicitado}</div>
                                            <small className="text-muted">Solicitados</small>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="text-center p-2 bg-light rounded">
                                            <div className="text-info fw-bold">{estadisticas.realizado}</div>
                                            <small className="text-muted">Realizados</small>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="text-center p-2 bg-light rounded">
                                            <div className="text-warning fw-bold">{estadisticas.analizado}</div>
                                            <small className="text-muted">Analizados</small>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-3">
                                        <div className="text-center p-2 bg-light rounded">
                                            <div className="text-success fw-bold">{estadisticas.entregado}</div>
                                            <small className="text-muted">Entregados</small>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="card-body px-2 pt-0 pb-3">
                            {examenes.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-file-medical fa-3x text-muted mb-3"></i>
                                    <h6>No se encontraron exámenes</h6>
                                    <p className="text-muted small">No tienes exámenes registrados en tu historial</p>
                                    <button 
                                        className="btn btn-outline-primary btn-sm mt-2"
                                        onClick={() => window.location.reload()}
                                    >
                                        <i className="fas fa-redo me-1"></i>
                                        Reintentar
                                    </button>
                                </div>
                            ) : (
                                <div className="history-list">
                                    {examenes.map((examen) => {
                                        const estadoInfo = getEstadoTexto(examen.estado);
                                        const disponible = isExamenDisponible(examen);
                                        const tipoArchivo = getTipoArchivo(examen.archivo_adjunto);
                                        const mensajeEstado = getMensajeEstado(examen.estado);
                                        
                                        return (
                                            <div key={examen._id} className="card history-card mb-3">
                                                <div className="card-body">
                                                    <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start gap-3">
                                                        <div className="d-flex flex-grow-1 w-100">
                                                            <div className="history-icon me-3 flex-shrink-0">
                                                                <svg 
                                                                    className={`icon ${getExamenIcon(examen.tipo_examen)}`} 
                                                                    viewBox="0 0 24 24" 
                                                                    width="40" 
                                                                    height="40"
                                                                >
                                                                    <path fill="currentColor" d={getExamenSvgIcon(examen.tipo_examen)} />
                                                                </svg>
                                                            </div>
                                                            <div className="history-details">
                                                                <div className="d-flex justify-content-between align-items-center mb-2">
                                                                    <h6 className="mb-0">{examen.tipo_examen}</h6>
                                                                    <span 
                                                                        className={`badge ${estadoInfo.clase}`}
                                                                        title={estadoInfo.descripcion}
                                                                    >
                                                                        {estadoInfo.texto}
                                                                    </span>
                                                                </div>
                                                                
                                                                <p className="doctor mb-1">
                                                                    <strong>Dr. {getNombreMedico(examen.medico_solicitante)}</strong>
                                                                    {getEspecialidadMedico(examen.medico_solicitante) && (
                                                                        <span className="text-muted small ms-2">
                                                                            ({getEspecialidadMedico(examen.medico_solicitante)})
                                                                        </span>
                                                                    )}
                                                                </p>

                                                                {examen.medico_realizador && (
                                                                    <p className="text-muted small mb-1">
                                                                        <i className="fas fa-user-md me-1"></i>
                                                                        Realizado por: Dr. {getNombreMedico(examen.medico_realizador)}
                                                                        {getEspecialidadMedico(examen.medico_realizador) && (
                                                                            <span className="ms-1">
                                                                                ({getEspecialidadMedico(examen.medico_realizador)})
                                                                            </span>
                                                                        )}
                                                                    </p>
                                                                )}

                                                                {examen.observaciones && (
                                                                    <p className="diagnosis text-muted small mb-2 d-none d-md-block">
                                                                        <i className="fas fa-sticky-note me-1"></i>
                                                                        {examen.observaciones}
                                                                    </p>
                                                                )}

                                                                <div className="d-flex flex-wrap gap-3 mt-2">
                                                                    <span className="text-muted small">
                                                                        <i className="fas fa-calendar me-1"></i>
                                                                        Solicitado: {formatFecha(examen.fecha_solicitud)}
                                                                    </span>
                                                                    
                                                                    {examen.fecha_realizacion && (
                                                                        <span className="text-muted small">
                                                                            <i className="fas fa-check-circle me-1"></i>
                                                                            Realizado: {formatFecha(examen.fecha_realizacion)}
                                                                        </span>
                                                                    )}
                                                                    
                                                                    {examen.archivo_adjunto && (
                                                                        <span className="text-muted small">
                                                                            <i className={`fas ${getIconoArchivo(tipoArchivo)} me-1`}></i>
                                                                            {tipoArchivo === 'imagen' ? 'Imágenes' : 'Documento'} disponible
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                {examen.resultado && (
                                                                    <div className="mt-2 p-2 bg-light rounded">
                                                                        <small className="text-dark">
                                                                            <strong>Resultado:</strong> {examen.resultado}
                                                                        </small>
                                                                    </div>
                                                                )}

                                                                {/* Mensaje informativo según estado */}
                                                                {!disponible && (
                                                                    <div className="mt-2">
                                                                        <small className="text-muted">
                                                                            <i className="fas fa-info-circle me-1"></i>
                                                                            {mensajeEstado}
                                                                        </small>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="d-flex flex-column flex-sm-row gap-2 align-items-stretch w-100 w-lg-auto">
                                                            <button 
                                                                className="btn btn-primary btn-sm"
                                                                onClick={() => solicitarDescargable(examen._id, examen.archivo_adjunto, examen.tipo_examen)}
                                                                disabled={!disponible}
                                                                title={disponible ? `Descargar ${examen.tipo_examen}` : mensajeEstado}
                                                            >
                                                                <svg className="icon me-1" viewBox="0 0 24 24" width="18" height="18">
                                                                    <path fill="currentColor" d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                                                                </svg>
                                                                {disponible ? getTextoBotonDescarga(tipoArchivo) : 'No Disponible'}
                                                            </button>
                                                            
                                                            <button
                                                                className="btn btn-outline-secondary btn-sm eye-icon-btn"
                                                                onClick={() => verExamen(examen.archivo_adjunto)}
                                                                disabled={!disponible}
                                                                aria-label={`Ver ${examen.tipo_examen}`}
                                                                title={disponible ? `Ver ${examen.tipo_examen}` : mensajeEstado}
                                                            >
                                                                <svg className="icon me-1" viewBox="0 0 24 24" width="18" height="18">
                                                                    <path fill="currentColor" d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z" />
                                                                </svg>
                                                                {disponible ? 'Ver Examen' : 'No Disponible'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
        </div>
    );
};

export default MisExamenes;