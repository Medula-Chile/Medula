import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import api from '../../../services/api';
import { formatDateTime } from '../../../utils/datetime';

export default function ConsultationDetailDoctor({ consulta }) {
  // Detalle de consulta para el flujo del Médico.
  const { user } = useAuth();
  const doctorName = (user?.fullName || user?.name || user?.nombre || [user?.firstName, user?.lastName].filter(Boolean).join(' ')).trim() || 'Médico/a';
  const doctorSpecialty = (user?.specialty || user?.especialidad || user?.profession || user?.titulo || 'Medicina General');
  if (!consulta) {
    return (
      <div className="card">
        <div className="card-header bg-white">
          <h5 className="card-title mb-0">Detalle de atención</h5>
        </div>
        <div className="card-body">
          <div className="text-center text-muted-foreground">
            <i className="fas fa-notes-medical fa-2x mb-3"></i>
            <p className="mb-1">No hay una atención seleccionada.</p>
            <p className="small mb-0">Selecciona un paciente del listado de la izquierda o inicia una nueva atención.</p>
          </div>
        </div>
      </div>
    );
  }
  // Estado local con detalle enriquecido desde backend (consulta guardada)
  const [detalle, setDetalle] = useState(consulta || null);
  const presion = detalle?.vitals?.presion ?? '—';
  const temperatura = detalle?.vitals?.temperatura ?? '—';
  const pulso = detalle?.vitals?.pulso ?? '—';

  // Paciente: nombre y ID desde la consulta seleccionada
  const pacienteObj = detalle?.paciente_id || detalle?.paciente || null;
  const pacienteId = (typeof pacienteObj === 'object')
    ? (pacienteObj?._id || pacienteObj?.id)
    : (detalle?.paciente_id || null);
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

  // Cargar desde backend la consulta guardada asociada a la cita seleccionada
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        if (!consulta?.id) { setDetalle(consulta || null); return; }
        // Ya tenemos todo? si hay diagnostico u observaciones reales, evita request
        const hasContent = (consulta?.diagnostico && consulta.diagnostico !== '—') ||
                           (Array.isArray(consulta?.examenes) && consulta.examenes.length > 0) ||
                           (consulta?.licencia && (consulta.licencia.otorga || consulta.licencia.dias || consulta.licencia.nota));
        if (hasContent && consulta?.recetaId) { setDetalle(consulta); return; }
        // Buscar por cita (intentar cita_id y citaId)
        let arr = [];
        try {
          const r1 = await api.get('/consultas', { params: { cita_id: consulta.id } });
          arr = Array.isArray(r1.data) ? r1.data : (Array.isArray(r1.data?.consultas) ? r1.data.consultas : []);
        } catch {}
        if (!arr.length) {
          try {
            const r2 = await api.get('/consultas', { params: { citaId: consulta.id } });
            arr = Array.isArray(r2.data) ? r2.data : (Array.isArray(r2.data?.consultas) ? r2.data.consultas : []);
          } catch {}
        }
        const saved = arr.find(x => String(x?.cita_id || x?.citaId || x?.cita || x?.consulta?.cita_id || x?.consulta?.citaId) === String(consulta.id)) || arr[0] || null;
        if (!cancelled) {
          if (saved) {
            // Normalizar campos y fusionar con info de la card
            const cdata = saved?.consulta || saved || {};
            const recetaObj = saved?.receta || cdata?.receta || null;
            const recetaId = saved?.recetaId || recetaObj?._id || recetaObj?.folio || recetaObj?.id || null;
            const merged = {
              ...consulta,
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

  return (
    <div className="card">
      <div className="card-header bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title mb-0">Atención del {formatDateTime(consulta?.when || detalle?.when, { style: 'detail' })}</h5>
          <span className={estadoClass}>{estado}</span>
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

        <div className="mb-4">
          <h6 className="fw-medium mb-2">Signos Vitales</h6>
          <p className="text-muted-foreground small bg-gray-100 p-3 rounded">
            Presión: {presion} • Temperatura: {temperatura} • Pulso: {pulso}
          </p>
        </div>

        <div className="row mb-4 small">
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0">Médico</p>
            <p className="fw-medium mb-0">{doctorName}</p>
          </div>
          <div className="col-6 col-md-6 mb-2">
            <p className="text-muted-foreground mb-0">Especialidad</p>
            <p className="fw-medium mb-0">{doctorSpecialty}</p>
          </div>
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
