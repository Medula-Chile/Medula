import React, { useMemo, useState } from 'react';
import TimeLineDoctor from './components/TimeLineDoctor';
import ConsultationDetailDoctor from './components/ConsultationDetailDoctor';
import ActiveMedicationsCard from '../../components/paciente/shared/ActiveMedicationsCard.jsx';
import QuickActionsCard from '../../components/paciente/shared/QuickActionsCard.jsx';
import NextAppointmentCard from '../../components/paciente/shared/NextAppointmentCard.jsx';
import api from '../../services/api';

// === Helper: parsear "15 Ago 2024" a Date ===
const MESES_ES = {
  ene: 0, enero: 0,
  feb: 1, febrero: 1,
  mar: 2, marzo: 2,
  abr: 3, abril: 3,
  may: 4, mayo: 4,
  jun: 5, junio: 5,
  jul: 6, julio: 6,
  ago: 7, agosto: 7,
  sep: 8, sept: 8, septiembre: 8,
  oct: 9, octubre: 9,
  nov: 10, noviembre: 10,
  dic: 11, diciembre: 11,
};

function parseFechaES(fechaStr) {
  if (!fechaStr) return null;
  const parts = fechaStr.trim().split(/\s+/); // ["15","Ago","2024"]
  if (parts.length < 3) return null;
  const dia = parseInt(parts[0], 10);
  const mesKey = parts[1].toLowerCase();
  const anio = parseInt(parts[2], 10);
  const mes = MESES_ES[mesKey] ?? null;
  if (Number.isNaN(dia) || Number.isNaN(anio) || mes == null) return null;
  // Mediodía UTC para evitar problemas de zona horaria
  const d = new Date(Date.UTC(anio, mes, dia, 12, 0, 0));
  return d;
}

export default function DoctorHistorial() {
  // Estado del item activo
  const [activeId, setActiveId] = useState(null);

  // === Buscador (exacto al de Pacientes) ===
  const [q, setQ] = useState('');
  const [estado, setEstado] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  // Búsqueda por RUT (guardado crudo en BD: ej 167812307)
  const [rut, setRut] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Timeline desde backend (sin mock inicial)
  const [timelineItems, setTimelineItems] = useState([]);

  // Formatear fecha a "DD Mon YYYY"
  const formatFecha = (dLike) => {
    const d = new Date(dLike);
    if (isNaN(d)) return '—';
    const meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    return `${String(d.getDate()).padStart(2,'0')} ${meses[d.getMonth()]} ${d.getFullYear()}`;
  };

  // Buscar por RUT en backend y mapear al timeline existente
  const fetchByRut = async () => {
    setError('');
    const rutClean = (rut || '').trim();
    if (!rutClean) { setError('Ingresa un RUT sin puntos ni guion, p.ej: 167812307'); return; }
    try {
      setLoading(true);
      const params = {
        rut: rutClean,
        desde: from || undefined,
        hasta: to || undefined,
        q: q || undefined,
      };
      const { data } = await api.get('/consultas', { params });
      const mapped = (Array.isArray(data) ? data : []).map((c) => {
        // medico_id en receta referencia a Usuario directamente (no a Medico)
        const medicoUsuario = c?.receta?.medico_id || {};
        const medicoEspecialidad = c?.receta?.medico_especialidad || c?.especialidad || '—';
        const medicoNombre = medicoUsuario?.nombre || '—';
        const medicoRut = medicoUsuario?.rut || '—';
        const pacienteObj = c?.receta?.paciente_id || null;
        const pacienteId = pacienteObj?._id || pacienteObj?.id || null;
        const pacienteNombre = c?.receta?.paciente_id?.usuario_id?.nombre || '—';

        const medico = medicoNombre ? `Dr. ${medicoNombre}` : '—';
        const fecha = c?.receta?.fecha_emision || c?.createdAt;
        const whenIso = fecha ? new Date(fecha).toISOString() : null;
        const resumen = c?.motivo || c?.diagnostico || c?.observaciones || '—';
        const meds = Array.isArray(c?.receta?.medicamentos) ? c.receta.medicamentos.map(m => `${m.nombre || ''} ${m.dosis || ''}`.trim()).filter(Boolean) : [];
        return {
          id: c?._id || Math.random().toString(36).slice(2),
          _id: c?._id || null,
          cita_id: c?.cita_id || null,
          especialidad: medicoEspecialidad || '—',
          medico,
          medicoNombre,
          medicoRut,
          medicoEspecialidad,
          pacienteNombre,
          paciente: pacienteNombre,
          paciente_id: pacienteId,
          fecha: formatFecha(fecha),
          when: whenIso,
          centro: c?.centro || '—',
          resumen,
          observaciones: c?.observaciones || resumen,
          estado: c?.estado || 'Completada',
          proximoControl: '—',
          medicamentos: meds,
          vitals: { presion: null, temperatura: null, pulso: null },
          recetaId: c?.recetaId || c?.receta?._id || '—',
          examIds: Array.isArray(c?.examenes) ? c.examenes : [],
          examenes: Array.isArray(c?.examenes) ? c.examenes : [],
        };
      });
      setTimelineItems(mapped);
      if (mapped.length) setActiveId(mapped[0].id);
    } catch (e) {
      setError('No se pudo cargar el historial para ese RUT');
    } finally {
      setLoading(false);
    }
  };

  // === Normalización a la forma que usa el buscador de Pacientes ===
  const itemsNormalizados = useMemo(() => {
    return timelineItems.map((it) => {
      const d = parseFechaES(it.fecha);
      return {
        id: it.id,
        paciente: it.medico || '—',               // Pacientes busca en "paciente", "resumen" y "centro"
        centro: it.centro || '—',
        resumen: it.resumen || it.observaciones || '—',
        estado: it.estado || 'Completada',
        when: d ? d.toISOString() : null,
        __raw: it,                                // referencia al original
      };
    });
  }, [timelineItems]);

  // === Lógica de filtrado/orden idéntica a Pacientes ===
  const filtered = useMemo(() => {
    const norm = (s) => (s || '').toString().toLowerCase();
    const qn = norm(q);
    const fromD = from ? new Date(from) : null;
    const toD = to ? new Date(to) : null;

    const inRange = (iso) => {
      if (!iso) return true;
      const d = new Date(iso);
      if (fromD && d < fromD) return false;
      if (toD) { const end = new Date(toD); end.setHours(23,59,59,999); if (d > end) return false; }
      return true;
    };

    const isToday = (iso) => {
      if (!iso) return false;
      const d = new Date(iso);
      const now = new Date();
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
    };

    const cmp = (a, b) => {
      const aD = new Date(a.when || 0);
      const bD = new Date(b.when || 0);
      const aT = isToday(a.when);
      const bT = isToday(b.when);
      if (aT && !bT) return -1; // Hoy primero
      if (!aT && bT) return 1;
      if (aT && bT) return aD - bD; // Dentro de hoy: asc
      return bD - aD; // Resto: desc (futuro→pasado)
    };

    return itemsNormalizados
      .filter(it =>
        !qn ||
        norm(it.paciente).includes(qn) ||
        norm(it.resumen).includes(qn) ||
        norm(it.centro).includes(qn)
      )
      .filter(it => !estado || it.estado === estado)
      .filter(it => inRange(it.when))
      .slice()
      .sort(cmp);
  }, [itemsNormalizados, q, estado, from, to]);

  // Volver a los originales para pintar
  const itemsFiltrados = useMemo(() => filtered.map(f => f.__raw), [filtered]);

  // Consulta activa actual
  const consulta = itemsFiltrados.find(x => x.id === activeId) || itemsFiltrados[0] || null;

  // Si cambia el filtro y el activeId quedó fuera, re-enfocar
  React.useEffect(() => {
    if (consulta?.id !== activeId) {
      if (consulta) setActiveId(consulta.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, estado, from, to, itemsFiltrados.length]);

  return (
    <>
      {/* === FILTROS A TODO EL ANCHO (mismo diseño que Pacientes, pero fuera de la grilla) === */}
      <div className="card mb-3">
        <div className="card-body doctor-search">
          <div className="row g-2 align-items-end">
            <div className="col-12 col-md-3 col-lg-2">
              <label className="form-label small mb-1">RUT</label>
              <div className="input-group input-group-sm">
                <span className="input-group-text"><i className="fas fa-id-card"></i></span>
                <input
                  className="form-control"
                  placeholder="167812307"
                  value={rut}
                  onChange={(e)=>setRut(e.target.value)}
                  onKeyDown={(e)=>{ if (e.key === 'Enter') fetchByRut(); }}
                />
              </div>
            </div>

            <div className="col-12 col-md-5 col-lg-5">
              <label className="form-label small mb-1">Buscar</label>
              <div className="input-group input-group-sm">
                <span className="input-group-text"><i className="fas fa-search"></i></span>
                <input
                  className="form-control"
                  placeholder="Paciente, centro o resumen"
                  value={q}
                  onChange={(e)=>setQ(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6 col-md-2 col-lg-2">
              <label className="form-label small mb-1">Estado</label>
              <select
                className="form-select form-select-sm"
                value={estado}
                onChange={(e)=>setEstado(e.target.value)}
              >
                <option value="">Todos</option>
                <option>En espera</option>
                <option>En progreso</option>
                <option>Completado</option>
                <option>Cancelado</option>
                <option>No presentado</option>
              </select>
            </div>

            <div className="col-6 col-md-1 col-lg-1">
              <label className="form-label small mb-1">Desde</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={from}
                onChange={(e)=>setFrom(e.target.value)}
              />
            </div>
            <div className="col-6 col-md-1 col-lg-1">
              <label className="form-label small mb-1">Hasta</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={to}
                onChange={(e)=>setTo(e.target.value)}
              />
            </div>

            <div className="col-12 col-md-12 col-lg-1 d-flex gap-2 justify-content-start justify-content-lg-end">
              <button className="btn btn-sm btn-primary" onClick={fetchByRut} disabled={loading} title="Buscar por RUT">
                <i className="fas fa-search me-1"/> Buscar
              </button>
            </div>

            <div className="col-12 col-lg-12 d-flex gap-3 mt-1">
              {loading && <span className="small text-muted d-flex align-items-center"><i className="fas fa-spinner fa-spin me-2"/>Cargando…</span>}
              {error && <span className="small text-danger d-flex align-items-center"><i className="fas fa-circle-exclamation me-2"/>{error}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* === GRILLA PRINCIPAL === */}
      <div className="row g-3">
        <div className="col-12 col-lg-6 col-xl-5">
          <div className="card h-100">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h6 className="mb-0">Historial de consultas</h6>
            </div>
            <div className="card-body p-0">
              <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 300px)' }}>
                {Array.isArray(itemsFiltrados) && itemsFiltrados.length > 0 ? (
                  <TimeLineDoctor
                    items={itemsFiltrados}
                    activeId={consulta?.id ?? activeId}
                    onSelect={setActiveId}
                  />
                ) : (
                  <div className="p-3 text-muted small">
                    <p className="mb-1"><i className="fas fa-info-circle me-2"></i>No hay resultados para mostrar.</p>
                    <p className="mb-0">Ingresa un <strong>RUT</strong> en el buscador y presiona <strong>Buscar</strong> para obtener información del paciente.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6 col-xl-7">
          <ConsultationDetailDoctor consulta={consulta} />
        </div>
      </div>
    </>
  );
}
