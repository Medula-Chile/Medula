import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import { formatDateTime } from '../../../utils/datetime';
export default function ConsultationDetailDoctor({ consulta }) {
  // Detalle de consulta para el flujo del Médico.
  const { user } = useAuth();
  const doctorNameAuth = (user?.fullName || user?.name || user?.nombre || [user?.firstName, user?.lastName].filter(Boolean).join(' ')).trim() || 'Médico/a';
  const doctorSpecialtyAuth = (user?.specialty || user?.especialidad || user?.profession || user?.titulo || 'Medicina General');
  
  // Estado local con detalle enriquecido desde backend (consulta guardada)
  const [detalle, setDetalle] = useState(null);
  
  // RESET INMEDIATO: Cuando cambia la consulta, resetear el detalle
  useEffect(() => {
    console.log('🔄 Consulta cambió, reseteando detalle:', {
      citaId: consulta?.id,
      paciente: consulta?.paciente,
      pacienteId: consulta?.paciente_id
    });
    setDetalle(consulta || null);
  }, [consulta]);
  
  const presion = detalle?.vitals?.presion ?? '—';
  const temperatura = detalle?.vitals?.temperatura ?? '—';
  const pulso = detalle?.vitals?.pulso ?? '—';

  // Paciente: nombre y ID desde la consulta seleccionada
  const pacienteObj = detalle?.paciente_id || detalle?.receta?.paciente_id || detalle?.paciente || null;
  const pacienteId = (typeof pacienteObj === 'object')
    ? (pacienteObj?._id || pacienteObj?.id)
    : (detalle?.paciente_id || detalle?.pacienteId || null);
  const [pacienteNombreFetched, setPacienteNombreFetched] = useState(null);
  const pacienteNombreGuess = (
    (typeof pacienteObj === 'string' ? pacienteObj : null) ||
    pacienteObj?.usuario?.nombre ||
    pacienteObj?.usuario?.fullName ||
    pacienteObj?.usuario?.name ||
    pacienteObj?.usuario_id?.nombre ||
    pacienteObj?.usuario_id?.fullName ||
    pacienteObj?.usuario_id?.name ||
    pacienteObj?.nombre ||
    [pacienteObj?.nombres, pacienteObj?.apellidos].filter(Boolean).join(' ')
  ) || detalle?.paciente || '—';

  // Cargar desde backend el detalle de la consulta
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        if (!consulta) { setDetalle(null); return; }
        
        // Si ya viene con contenido útil, no disparamos request
        const alreadyRich = (consulta?.diagnostico && consulta.diagnostico !== '—') ||
                            (Array.isArray(consulta?.examenes) && consulta.examenes.length > 0) ||
                            (consulta?.recetaId || consulta?.receta) ||
                            (consulta?.observaciones && consulta.observaciones !== '—');
        if (alreadyRich) { setDetalle(consulta); return; }

        // Obtener IDs relevantes
        const citaId = consulta.id || consulta._id || consulta?.cita_id || consulta?.citaId;
        const consultaPacienteId = (
          consulta?.paciente_id?._id || 
          consulta?.paciente_id || 
          consulta?.pacienteId ||
          consulta?.receta?.paciente_id?._id ||
          consulta?.receta?.paciente_id
        );
        
        if (!citaId) {
          setDetalle(consulta);
          return;
        }

        let saved = null;

        // ESTRATEGIA 1: Buscar por cita_id (caso más común en DoctorPacientes)
        // El objeto que llega es una CITA, no una CONSULTA, por lo que su ID es el cita_id
        try {
          console.log('🔍 Buscando consulta por cita_id:', citaId, 'paciente:', consultaPacienteId);
          const r1 = await api.get('/consultas', { params: { cita_id: citaId } });
          const arr1 = Array.isArray(r1.data) ? r1.data : (Array.isArray(r1.data?.consultas) ? r1.data.consultas : []);
          console.log('📦 Consultas encontradas:', arr1.length, arr1.map(x => ({
            _id: x._id,
            cita_id: x.cita_id,
            paciente_id: x.paciente_id?._id || x.paciente_id,
            diagnostico: x.diagnostico
          })));
          
          // Filtrar por paciente si está disponible
          const filtered1 = consultaPacienteId
            ? arr1.filter(x => {
                const xPacId = x?.paciente_id?._id || x?.paciente_id || x?.pacienteId;
                const match = String(xPacId) === String(consultaPacienteId);
                console.log('  Filtro paciente:', xPacId, '===', consultaPacienteId, '?', match);
                return match;
              })
            : arr1;
          
          console.log('✅ Consultas filtradas:', filtered1.length);
          
          // Buscar la que coincida exactamente con el cita_id
          saved = filtered1.find(x => String(x?.cita_id || x?.citaId) === String(citaId)) || filtered1[0] || null;
          
          if (saved) {
            console.log('✅ Consulta encontrada:', {
              _id: saved._id,
              cita_id: saved.cita_id,
              paciente_id: saved.paciente_id?._id || saved.paciente_id,
              diagnostico: saved.diagnostico
            });
          } else {
            console.log('❌ No se encontró consulta para esta cita');
          }
        } catch (err) {
          console.log('❌ Error buscando consulta por cita_id:', citaId, err.message);
        }

        // ESTRATEGIA 2: Solo si parece ser un ID de consulta (no de cita)
        // Las consultas vienen con diagnostico, observaciones, etc.
        // Las citas solo tienen motivo, estado, fecha_hora
        if (!saved && consulta?._id && consulta?.diagnostico) {
          // Parece ser una consulta completa, intentar por ID directo
          try {
            console.log('🔍 Intentando buscar por ID directo (parece consulta):', citaId);
            const r = await api.get(`/consultas/${citaId}`);
            const data = r.data || null;
            // Validar que sea del mismo paciente si está disponible
            if (data && consultaPacienteId) {
              const dataPacId = data?.paciente_id?._id || data?.paciente_id || data?.pacienteId;
              if (String(dataPacId) === String(consultaPacienteId)) {
                saved = data;
                console.log('✅ Consulta encontrada por ID directo');
              }
            } else if (data) {
              saved = data;
              console.log('✅ Consulta encontrada por ID directo (sin validar paciente)');
            }
          } catch (err) {
            console.log('❌ No se encontró consulta por ID directo:', citaId, err.message);
          }
        }

        if (!cancelled) {
          if (saved) {
            const cdata = saved?.consulta || saved || {};
            const recetaObj = saved?.receta || cdata?.receta || null;
            const recetaId = saved?.recetaId || recetaObj?._id || recetaObj?.folio || recetaObj?.id || null;
            const whenGuess = consulta?.when || cdata?.when || saved?.createdAt || recetaObj?.fecha_emision || saved?.fecha || null;
            const merged = {
              ...consulta,
              _id: saved?._id || consulta?._id || null,
              motivo: cdata?.motivo ?? consulta?.motivo ?? consulta?.resumen ?? null,
              sintomas: cdata?.sintomas ?? consulta?.sintomas ?? null,
              diagnostico: cdata?.diagnostico ?? consulta?.diagnostico ?? null,
              observaciones: cdata?.observaciones ?? consulta?.observaciones ?? null,
              tratamiento: cdata?.tratamiento ?? consulta?.tratamiento ?? null,
              examenes: Array.isArray(cdata?.examenes) ? cdata.examenes : (Array.isArray(consulta?.examenes) ? consulta.examenes : []),
              licencia: cdata?.licencia ?? consulta?.licencia ?? null,
              vitals: cdata?.vitals ?? consulta?.vitals ?? null,
              receta: recetaObj,
              recetaId: recetaId ?? consulta?.recetaId ?? null,
              lastUpdated: saved?.updatedAt || saved?.fechaActualizacion || saved?.fecha || saved?.createdAt || null,
              when: whenGuess ? (new Date(whenGuess).toISOString()) : (consulta?.when || null),
              // Datos del médico que atendió
              medicoNombre: consulta?.medicoNombre || cdata?.receta?.medico_id?.nombre || cdata?.medicoNombre || null,
              medicoRut: consulta?.medicoRut || cdata?.receta?.medico_id?.rut || cdata?.medicoRut || null,
              medicoEspecialidad: consulta?.medicoEspecialidad || cdata?.receta?.medico_especialidad || cdata?.medicoEspecialidad || null,
            };
            setDetalle(merged);
          } else {
            setDetalle(consulta);
          }
        }
      } catch {
        if (!cancelled) setDetalle(consulta || null);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [consulta]);

  // Enriquecer con Centro desde la Cita (usa cita_id)
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const cid = consulta?.cita_id || consulta?.citaId || consulta?.id;
        if (!cid) return;
        const r = await api.get(`/citas/${cid}`);
        const c = r.data || {};
        const centroNombre = c?.centro_id?.nombre || c?.centro?.nombre || c?.centro || null;
        const centroDireccion = c?.centro_id?.direccion || c?.centro?.direccion || null;
        if (!cancelled && (centroNombre || centroDireccion)) {
          setDetalle(prev => ({ ...(prev || {}), centro: centroNombre || prev?.centro || '—', centroDireccion: centroDireccion || prev?.centroDireccion || null }));
        }
      } catch {}
    };
    run();
    return () => { cancelled = true; };
  }, [consulta]);

  // Si el "nombre" parece un ObjectId o un ID sin espacios, intentar obtener nombre real desde API
  useEffect(() => {
    let cancelled = false;
    const looksLikeId = (s) => {
      if (!s || typeof s !== 'string') return false;
      if (/^[a-f0-9]{24}$/i.test(s)) return true; // ObjectId
      if (s.length > 12 && !s.includes(' ')) return true; // id alfanumérico
      return false;
    };
    const run = async () => {
      try {
        if (!pacienteId) { setPacienteNombreFetched(null); return; }
        if (!looksLikeId(pacienteNombreGuess)) { setPacienteNombreFetched(null); return; }
        const r = await api.get(`/pacientes/${pacienteId}`);
        const d = r.data || {};
        const name = (
          d?.usuario?.nombre || d?.usuario?.fullName || d?.usuario?.name ||
          d?.usuario_id?.nombre || d?.usuario_id?.fullName || d?.usuario_id?.name ||
          d?.nombre || [d?.nombres, d?.apellidos].filter(Boolean).join(' ')
        ) || null;
        if (!cancelled) setPacienteNombreFetched(name);
      } catch { if (!cancelled) setPacienteNombreFetched(null); }
    };
    run();
    return () => { cancelled = true; };
  }, [pacienteId, pacienteNombreGuess]);

  const pacienteNombre = pacienteNombreFetched || pacienteNombreGuess;
  // Datos clínicos del paciente
  const [pacienteAlergias, setPacienteAlergias] = useState([]);
  const [pacienteCronicas, setPacienteCronicas] = useState([]);

  // Fetch de alergias y enfermedades crónicas desde Paciente
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        if (!pacienteId) { if (!cancelled) { setPacienteAlergias([]); setPacienteCronicas([]); } return; }
        const r = await api.get(`/pacientes/${pacienteId}`);
        const d = r.data || {};
        const alerg = Array.isArray(d?.alergias) ? d.alergias.filter(Boolean) : [];
        const cr = Array.isArray(d?.enfermedades_cronicas) ? d.enfermedades_cronicas.filter(Boolean) : [];
        if (!cancelled) { setPacienteAlergias(alerg); setPacienteCronicas(cr); }
      } catch {
        if (!cancelled) { setPacienteAlergias([]); setPacienteCronicas([]); }
      }
    };
    run();
    return () => { cancelled = true; };
  }, [pacienteId]);
  // Exámenes vinculados a la consulta/paciente
  const [examenesVinculados, setExamenesVinculados] = useState([]);
  const [examenesLoading, setExamenesLoading] = useState(false);
  const [estadoFiltro, setEstadoFiltro] = useState(''); // '', solicitado, realizado, analizado, entregado
  
  const fetchExamenes = async () => {
    let cancelled = false;
    try {
      setExamenesLoading(true);
      
      // Solo buscar exámenes si hay un ID de consulta guardada
      // NO buscar por paciente para evitar mostrar exámenes de otras consultas
      const consultaId = detalle?._id || detalle?._consultaId;
      if (!consultaId) {
        setExamenesVinculados([]);
        setExamenesLoading(false);
        return;
      }
      
      const params = { consulta: consultaId };
      if (estadoFiltro) params.estado = estadoFiltro;
      
      const r = await api.get('/examenes', { params });
      if (!cancelled) setExamenesVinculados(Array.isArray(r.data) ? r.data : []);
    } catch {
      setExamenesVinculados([]);
    } finally {
      setExamenesLoading(false);
    }
    return () => { cancelled = true; };
  };
  
  useEffect(() => {
    // Resetear exámenes cuando cambia la consulta
    setExamenesVinculados([]);
    
    // Solo cargar si hay ID de consulta
    const consultaId = detalle?._id || detalle?._consultaId;
    if (consultaId) {
      fetchExamenes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consulta?.id, detalle?._id, detalle?._consultaId, estadoFiltro]);

  // Medicamentos desde receta guardada
  const medsFromReceta = Array.isArray(detalle?.receta?.medicamentos)
    ? detalle.receta.medicamentos.map(m => {
        const parts = [m?.nombre || m?.medicamento || m?.medicamento_nombre].filter(Boolean);
        if (m?.dosis) parts.push(m.dosis);
        if (m?.frecuencia) parts.push(m.frecuencia);
        if (m?.duracion) parts.push(`${m.duracion} días`);
        if (m?.instrucciones) parts.push(m.instrucciones);
        return parts.join(' • ');
      })
    : [];

  // Construir listas seguras para mostrar
  const legacyMeds = Array.isArray(detalle?.medicamentos) ? detalle.medicamentos : [];
  const structMeds = Array.isArray(detalle?.medicamentosDet)
    ? detalle.medicamentosDet.map(m => {
        const parts = [m?.nombre].filter(Boolean);
        if (m?.dias) parts.push(`${m.dias} días`);
        if (m?.frecuencia) parts.push(m.frecuencia);
        return parts.length ? parts.join(' • ') : null;
      }).filter(Boolean)
    : [];
  const medsToShow = [...legacyMeds, ...structMeds];

  const examenes = Array.isArray(detalle?.examenes) ? detalle.examenes : [];
  const licOtorga = !!detalle?.licencia?.otorga;
  const licDias = licOtorga ? (detalle?.licencia?.dias ?? '—') : '—';
  const licNota = licOtorga ? (detalle?.licencia?.nota || '—') : '—';
  // Folio/ID de receta (compatibilidad: usa recetaId o _id dentro de receta)
  const recId = detalle?.recetaId || detalle?.receta?._id || detalle?.receta?.folio || null;

  const estado = detalle?.estado || 'En progreso';
  const estadoClass = estado === 'Completado'
    ? 'custom-badge border-success text-white bg-success'
    : (estado === 'En progreso'
      ? 'custom-badge border-warning text-dark bg-warning'
      : 'custom-badge border-secondary text-white bg-secondary');

  // Datos del médico que realizó la consulta (preferir datos de la consulta sobre el usuario autenticado)
  const displayDoctorName = (detalle?.medicoNombre || consulta?.medicoNombre || detalle?.medico || consulta?.medico || doctorNameAuth);
  const displayDoctorRut = (detalle?.medicoRut || consulta?.medicoRut || null);
  const displayDoctorSpec = (detalle?.medicoEspecialidad || consulta?.medicoEspecialidad || detalle?.especialidad || consulta?.especialidad || doctorSpecialtyAuth);

  return (
    <div className="card">
      <div className="card-header bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Atención del {formatDateTime(consulta?.when || detalle?.when, { style: 'detail' })}</h5>
          <span className={estadoClass}>{estado}</span>
        </div>
        {/* Alergias y Enfermedades crónicas */}
        <div className="row mb-4 small">
          <div className="col-12 col-md-6 mb-2">
            <p className="text-muted-foreground mb-1">Alergias</p>
            {Array.isArray(pacienteAlergias) && pacienteAlergias.length > 0 ? (
              <div className="d-flex flex-wrap gap-2">
                {pacienteAlergias.map((a, idx) => (
                  <span key={`alg-${idx}`} className="badge bg-danger-subtle text-danger border">{a}</span>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">—</p>
            )}
          </div>
          <div className="col-12 col-md-6 mb-2">
            <p className="text-muted-foreground mb-1">Enfermedades crónicas</p>
            {Array.isArray(pacienteCronicas) && pacienteCronicas.length > 0 ? (
              <div className="d-flex flex-wrap gap-2">
                {pacienteCronicas.map((e, idx) => (
                  <span key={`cr-${idx}`} className="badge bg-warning-subtle text-dark border">{e}</span>
                ))}
              </div>
            ) : (
              <p className="text-muted mb-0">—</p>
            )}
          </div>
        </div>
      </div>
      <div className="card-body watermark-bg">
        {/* Paciente */}
        <div className="row mb-4 small">
          <div className="col-12 col-md-8 mb-2">
            <p className="text-muted-foreground mb-0">Paciente</p>
            <p className="fw-medium mb-0">
              {pacienteNombre}
              {pacienteId ? <span className="text-muted ms-2">• {String(pacienteId)}</span> : null}
            </p>
          </div>
          <div className="col-12 col-md-4 mb-2">
            <p className="text-muted-foreground mb-0">Centro</p>
            <p className="fw-medium mb-0">{detalle?.centro || '—'}</p>
            {detalle?.centroDireccion && (
              <p className="text-muted small mb-0">{detalle.centroDireccion}</p>
            )}
          </div>
          {detalle?.lastUpdated ? (
            <div className="col-12 mt-1">
              <p className="text-muted-foreground small mb-0">
                Última actualización: {formatDateTime(detalle.lastUpdated, { style: 'detail' })}
              </p>
            </div>
          ) : null}
        </div>
        <div className="mb-4">
          <h6 className="fw-medium mb-2">Motivo de consulta</h6>
          <p className="text-muted-foreground small bg-gray-100 p-3 rounded">{detalle?.motivo || detalle?.resumen || '—'}</p>
        </div>
        <div className="mb-4">
          <h6 className="fw-medium mb-2">Diagnóstico</h6>
          <p className="text-muted-foreground small bg-gray-100 p-3 rounded">{detalle?.diagnostico || '—'}</p>
        </div>
        <div className="mb-4">
          <h6 className="fw-medium mb-2">Observaciones</h6>
          <p className="text-muted-foreground small bg-gray-100 p-3 rounded">{detalle?.observaciones || '—'}</p>
        </div>
        <div className="mb-4">
          <h6 className="fw-medium mb-2">Tratamiento indicado</h6>
          <p className="text-muted-foreground small bg-gray-100 p-3 rounded">{detalle?.tratamiento || '—'}</p>
        </div>

        {/* Exámenes vinculados */}
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2 gap-2 flex-wrap">
            <h6 className="fw-medium mb-0">Exámenes vinculados</h6>
            <div className="d-flex align-items-center gap-2">
              <select className="form-select form-select-sm" value={estadoFiltro} onChange={(e)=>setEstadoFiltro(e.target.value)}>
                <option value="">Todos</option>
                <option value="solicitado">Solicitado</option>
                <option value="realizado">Realizado</option>
                <option value="analizado">Analizado</option>
                <option value="entregado">Entregado</option>
              </select>
              <button type="button" className="btn btn-outline-secondary btn-sm" onClick={fetchExamenes} disabled={examenesLoading}>
                {examenesLoading ? 'Actualizando…' : 'Refrescar'}
              </button>
            </div>
          </div>
          {Array.isArray(examenesVinculados) && examenesVinculados.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-sm align-middle">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th>Solicitado</th>
                    <th>Realización</th>
                    <th>Adjunto</th>
                  </tr>
                </thead>
                <tbody>
                  {examenesVinculados.map(ex => (
                    <tr key={ex._id}>
                      <td>{ex.tipo_examen}</td>
                      <td><span className="badge bg-light text-dark border">{ex.estado}</span></td>
                      <td>{ex.fecha_solicitud ? formatDateTime(ex.fecha_solicitud, { style: 'detail' }) : '—'}</td>
                      <td>{ex.fecha_realizacion ? formatDateTime(ex.fecha_realizacion, { style: 'detail' }) : '—'}</td>
                      <td>
                        {ex.archivo_adjunto ? (
                          <a href={ex.archivo_adjunto} target="_blank" rel="noreferrer">Ver</a>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-muted-foreground small mb-0">No hay exámenes vinculados.</p>
          )}
        </div>

        {/* Se removió la sección de Signos Vitales a solicitud */}

        <div className="row mb-4 small">
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0">Próximo control</p>
            <p className="fw-medium mb-0">{detalle?.proximoControl || '—'}</p>
          </div>
          <div className="col-12 col-md-12 mb-2">
            <p className="text-muted-foreground mb-0">Receta vinculada</p>
            <div className="fw-medium mb-0">
              {recId ? (
                <>
                  <a className="link-primary" href={`/doctor/recetas?folio=${encodeURIComponent(String(recId))}`}>
                    Ver receta
                  </a>
                  <div className="small text-muted mt-1">ID: <code>{String(recId)}</code></div>
                </>
              ) : '—'}
            </div>
          </div>
        </div>

        <div>
          <h6 className="fw-medium mb-2">Medicamentos Prescritos</h6>
          <div className="d-flex flex-column gap-2">
            {((medsFromReceta && medsFromReceta.length > 0) || medsToShow.length > 0)
              ? (
                <>
                  {(medsFromReceta || []).map((m, idx) => (
                    <div key={`med-receta-${idx}`} className="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
                      <i className="fas fa-pills text-success"></i>
                      <span className="small">{m}</span>
                    </div>
                  ))}
                  {medsToShow.map((m, idx) => (
                    <div key={`med-any-${idx}`} className="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
                      <i className="fas fa-pills text-success"></i>
                      <span className="small">{m}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
                  <i className="fas fa-pills text-muted"></i>
                  <span className="small">—</span>
                </div>
              )}
          </div>
        </div>

        {/* Exámenes solicitados */}
        <div className="mt-4">
          <h6 className="fw-medium mb-2">Exámenes solicitados</h6>
          <div className="d-flex flex-column gap-2">
            {examenes.length > 0 ? (
              examenes.map((ex, idx) => (
                <div key={`ex-${idx}`} className="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
                  <i className="fas fa-vials text-primary"></i>
                  <span className="small">{ex}</span>
                </div>
              ))
            ) : (
              <div className="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
                <i className="fas fa-vials text-muted"></i>
                <span className="small">—</span>
              </div>
            )}
          </div>
        </div>

        {/* Licencia médica */}
        <div className="mt-4">
          <h6 className="fw-medium mb-2">Licencia médica</h6>
          <div className="row small">
            <div className="col-12 col-md-4 mb-2">
              <p className="text-muted-foreground mb-0">Otorga</p>
              <p className="fw-medium mb-0">{licOtorga ? 'Sí' : 'No'}</p>
            </div>
            <div className="col-12 col-md-4 mb-2">
              <p className="text-muted-foreground mb-0">Días</p>
              <p className="fw-medium mb-0">{licDias}</p>
            </div>
            <div className="col-12 col-md-4 mb-2">
              <p className="text-muted-foreground mb-0">Nota</p>
              <p className="fw-medium mb-0">{licNota}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
