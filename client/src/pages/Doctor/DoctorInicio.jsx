import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import api from '../../services/api';
import TimelineMedico from './components/TimelineMedico';
import ConsultationDetailDoctor from './components/ConsultationDetailDoctor';
import ModalAtencion from './components/ModalAtencion';
import { useAuth } from '../../contexts/AuthContext';
import { subscribe, getAssignments, seedIfEmpty, upsertAssignment, setAssignments } from './data/assignmentsStore';
import { formatDateTime } from '../../utils/datetime';

export default function DoctorInicio() {
  // Vista principal del Médico
  // Estructura: Timeline (izquierda), Detalle (centro), Panel derecho (métricas/avisos)
  // Obtener el usuario (doctor) activo de la sesión
  const { user } = useAuth();
  const doctorName = (user?.fullName || user?.name || [user?.firstName, user?.lastName].filter(Boolean).join(' ')).trim() || 'Médico/a';
  const doctorSpecialty = (user?.specialty || user?.especialidad || user?.profession || user?.titulo || 'Medicina General');
  // Id de usuario (profesional) autenticado: se usa para filtrar citas del backend
  const doctorUserId = user?.id || user?._id || null;

  // Fuente de datos: store maestro de asignaciones
  const [allItems, setAllItems] = useState(() => getAssignments());
  const [activeId, setActiveId] = useState(allItems[0]?.id ?? null);
  // Seed inicial si está vacío (será sobreescrito por datos reales si existen)
  useEffect(() => { seedIfEmpty({ doctorName, doctorSpecialty }); }, [doctorName, doctorSpecialty]);
  // Suscripción al store
  useEffect(() => {
    const unsub = subscribe((arr) => {
      // Mantener nombre/especialidad sincronizados del usuario
      const merged = arr.map(it => ({
        ...it,
        medico: doctorName || it.medico,
        especialidad: doctorSpecialty || it.especialidad,
      }));
      setAllItems(merged);
      if (!merged.find(it => String(it.id) === String(activeId))) {
        setActiveId(merged[0]?.id ?? null);
      }
    });
    // Inicial
    const init = getAssignments();
    setAllItems(init.map(it => ({ ...it, medico: doctorName || it.medico, especialidad: doctorSpecialty || it.especialidad })));
    return () => unsub();
  }, [doctorName, doctorSpecialty, user]);
  // Cargar citas del backend y sincronizar store local
  const fetchCitasHoy = useCallback(async () => {
      try {
        // Resolver userId localmente para evitar problemas de cierre/orden
        const uid = user?.id || user?._id || null;
        if (!uid) return; // Evitar cargar todas las citas sin filtro antes de que el usuario esté listo
        // Filtrar por el profesional (usuario) en sesión para no traer citas de otros médicos
        const resp = await api.get('/citas', { params: { profesional: uid } });
        let raw = Array.isArray(resp.data) ? resp.data : (resp.data?.citas || []);
        // Salvaguarda: filtrar en cliente por profesional_id si el backend no aplicó el filtro
        raw = raw.filter(c => {
          const pid = (typeof c?.profesional_id === 'object') ? (c?.profesional_id?._id || c?.profesional_id?.id) : c?.profesional_id;
          return String(pid) === String(uid);
        });
        const now = new Date();
        const y = now.getFullYear(), m = now.getMonth(), d = now.getDate();
        const start = new Date(y, m, d, 0, 0, 0, 0);
        const end = new Date(y, m, d, 23, 59, 59, 999);
        const parseWhen = (c) => {
          const candidates = [
            c.fecha_hora,
            c.fecha,
            c.fecha_cita,
            c.fechaHora,
            c.hora_cita,
            c.when,
            c.hora,
            c.createdAt,
            c.updatedAt,
          ].filter(Boolean);
          const dt = candidates.length ? new Date(candidates[0]) : null;
          return dt ? dt.toISOString() : new Date().toISOString();
        };
        const inToday = (iso) => { const dt = new Date(iso); return dt >= start && dt <= end; };
        const mapItem = (c) => {
          const whenIso = parseWhen(c);
          const pacienteRaw = c?.paciente_id || c?.paciente || null;
          const pacienteObj = (typeof pacienteRaw === 'object') ? pacienteRaw : null;
          const pacienteId = pacienteObj?._id || pacienteObj?.id || c?.pacienteId || (typeof c?.paciente_id === 'string' ? c.paciente_id : null);
          const pacienteNombre = (
            (typeof pacienteRaw === 'string' ? pacienteRaw : null) ||
            pacienteObj?.usuario?.nombre ||
            pacienteObj?.usuario?.fullName ||
            pacienteObj?.usuario?.name ||
            pacienteObj?.usuario_id?.nombre ||
            pacienteObj?.usuario_id?.fullName ||
            pacienteObj?.usuario_id?.name ||
            pacienteObj?.nombre ||
            [pacienteObj?.nombres, pacienteObj?.apellidos].filter(Boolean).join(' ') ||
            [pacienteObj?.firstName, pacienteObj?.lastName].filter(Boolean).join(' ')
          ) || c?.paciente_nombre || c?.pacienteNombre || c?.paciente_nombre_completo || null;
          const centroNombre = c?.centro || c?.centro_id?.nombre || c?.centroSalud?.nombre || c?.centro_salud?.nombre || '—';
          // Normalizar estado desde backend a etiquetas UI
          const estadoRaw = c?.estado;
          let estadoNorm = 'En espera';
          if (estadoRaw) {
            const s = String(estadoRaw).toLowerCase();
            if (s.includes('complet')) estadoNorm = 'Completado';
            else if (s.includes('progreso')) estadoNorm = 'En progreso';
            else if (s.includes('program') || s.includes('agenda')) estadoNorm = 'Programada';
            else if (s.includes('cancel')) estadoNorm = 'Cancelado';
            else if (s.includes('no') && s.includes('present')) estadoNorm = 'No presentado';
          }
          return {
            id: c._id || c.id,
            paciente_id: pacienteId,
            paciente: pacienteNombre || '—',
            medico: doctorName,
            especialidad: c?.especialidad || doctorSpecialty,
            centro: centroNombre,
            resumen: c?.motivo || c?.resumen || '—',
            motivo: c?.motivo || c?.resumen || null,
            diagnostico: c?.diagnostico || null,
            tratamiento: c?.tratamiento || null,
            estado: estadoNorm,
            when: whenIso,
            fecha: formatDateTime(whenIso),
            observaciones: c?.observaciones || '—',
            proximoControl: c?.proximoControl || '—',
            recetaId: c?.recetaId || null,
            vitals: { presion: null, temperatura: null, pulso: null },
            medicamentos: [],
            medicamentosDet: Array.isArray(c?.receta?.medicamentos)
              ? c.receta.medicamentos.map(m => ({ nombre: m.nombre, dias: m.duracion, frecuencia: m.frecuencia }))
              : [],
            examenes: Array.isArray(c?.examenes) ? c.examenes : [],
            licencia: { otorga: !!c?.licencia?.otorga, dias: c?.licencia?.dias ?? null, nota: c?.licencia?.nota || '' },
          };
        };
        const today = raw
          .map(mapItem)
          .filter(it => inToday(it.when));
        // Debug: ver campos relevantes de paciente en primeros items
        try {
          if (process?.env?.NODE_ENV !== 'production') {
            console.debug('[DoctorInicio] citas hoy (raw->mapped):', today.slice(0, 5).map(it => ({ id: it.id, paciente_id: it.paciente_id, paciente: it.paciente })));
          }
        } catch {}
        // Enriquecer con nombre de paciente si no viene en la cita
        const enriched = await Promise.all(today.map(async (it) => {
          // Primer intento: si tenemos paciente_id, traer nombre desde /pacientes/:id
          if ((it.paciente === '—' || !it.paciente) && it.paciente_id) {
            try {
              const pr = await api.get(`/pacientes/${it.paciente_id}`);
              const pd = pr.data || {};
              const name = (
                pd?.usuario?.nombre ||
                pd?.usuario?.fullName ||
                pd?.usuario?.name ||
                pd?.usuario_id?.nombre ||
                pd?.usuario_id?.fullName ||
                pd?.usuario_id?.name ||
                pd?.nombre ||
                [pd?.nombres, pd?.apellidos].filter(Boolean).join(' ') ||
                [pd?.firstName, pd?.lastName].filter(Boolean).join(' ')
              ) || null;
              if (name) return { ...it, paciente: name };
            } catch (e) {
              try { if (process?.env?.NODE_ENV !== 'production') console.debug('[DoctorInicio] fallo /pacientes/:id', it.paciente_id, e?.message); } catch {}
            }
          }
          // Segundo intento: consultar la cita individual para obtener paciente/usuario
          if ((it.paciente === '—' || !it.paciente) && it.id) {
            try {
              const cr = await api.get(`/citas/${it.id}`);
              const c = cr.data || {};
              const pObj = c?.paciente_id || c?.paciente || null;
              const pid = (typeof pObj === 'object') ? (pObj?._id || pObj?.id) : (typeof c?.paciente_id === 'string' ? c.paciente_id : null);
              const name = (
                (typeof pObj === 'string' ? pObj : null) ||
                pObj?.usuario?.nombre ||
                pObj?.usuario?.fullName ||
                pObj?.usuario?.name ||
                pObj?.usuario_id?.nombre ||
                pObj?.usuario_id?.fullName ||
                pObj?.usuario_id?.name ||
                pObj?.nombre ||
                [pObj?.nombres, pObj?.apellidos].filter(Boolean).join(' ') ||
                [pObj?.firstName, pObj?.lastName].filter(Boolean).join(' ')
              ) || c?.paciente_nombre || c?.pacienteNombre || null;
              if (pid || name) return { ...it, paciente_id: it.paciente_id || pid || null, paciente: it.paciente || name || '—' };
            } catch (e) {
              try { if (process?.env?.NODE_ENV !== 'production') console.debug('[DoctorInicio] fallo /citas/:id', it.id, e?.message); } catch {}
            }
          }
          return it;
        }));
        try {
          if (process?.env?.NODE_ENV !== 'production') {
            console.debug('[DoctorInicio] citas enriquecidas (preview):', enriched.slice(0, 5).map(it => ({ id: it.id, paciente_id: it.paciente_id, paciente: it.paciente })));
          }
        } catch {}
        setAssignments(enriched);
      } catch (err) {
        // No romper la UI si el backend no responde
        // console.error('fetchCitasHoy error', err);
      }
  }, [doctorName, doctorSpecialty]);

  // Cargar al montar + polling ligero
  useEffect(() => {
    let mounted = true;
    fetchCitasHoy();
    const t = setInterval(() => { if (mounted) fetchCitasHoy(); }, 30000);
    return () => { mounted = false; clearInterval(t); };
  }, [fetchCitasHoy]);

  // Filtrar solo las atenciones de hoy para el timeline
  const todayItems = useMemo(() => {
    const now = new Date();
    const y = now.getFullYear(), m = now.getMonth(), d = now.getDate();
    const start = new Date(y, m, d, 0, 0, 0, 0);
    const end = new Date(y, m, d, 23, 59, 59, 999);
    const inToday = (iso) => {
      if (!iso) return false;
      const dt = new Date(iso);
      return dt >= start && dt <= end;
    };
    const byTime = (a, b) => new Date(a.when || 0) - new Date(b.when || 0);
    return allItems.filter(it => inToday(it.when)).slice().sort(byTime);
  }, [allItems]);
  const consulta = useMemo(() => (todayItems.find(x => String(x.id) === String(activeId)) || null), [todayItems, activeId]);
  const [open, setOpen] = useState(false);
  const [doctorMedicoId, setDoctorMedicoId] = useState(null);

  // Resolver el _id del modelo Medico a partir del usuario autenticado
  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        if (!doctorUserId) { setDoctorMedicoId(null); return; }
        const resp = await api.get('/medicos');
        const arr = Array.isArray(resp.data) ? resp.data : [];
        // Coincidir por usuario_id del Medico con el id del usuario autenticado
        const found = arr.find(m => String(m?.usuario_id?._id || m?.usuario_id) === String(doctorUserId));
        if (!cancelled) setDoctorMedicoId(found?._id || null);
      } catch {
        if (!cancelled) setDoctorMedicoId(null);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [doctorUserId]);
  const pacienteId = useMemo(() => {
    if (!consulta) return null;
    return consulta?.paciente_id?._id || consulta?.paciente_id || consulta?.pacienteId || null;
  }, [consulta]);

  // Asegurar selección válida dentro de los items de hoy
  useEffect(() => {
    if (!Array.isArray(todayItems)) return;
    if (todayItems.length === 0) return; // no forzar nada si no hay atenciones hoy
    const belongs = todayItems.some(it => String(it.id) === String(activeId));
    if (!belongs) {
      setActiveId(todayItems[0]?.id ?? null);
    }
  }, [todayItems, activeId]);
  
  // Formulario del modal de atención
  const [form, setForm] = useState({
    observaciones: '',
    presion: '',
    temperatura: '',
    pulso: '',
    proximoControl: '',
    recetaId: '',
    // Medicamentos detallados (nuevos)
    medicamentosDet: [],
    medNombre: '',
    medDias: '',
    medFrecuencia: '',
    // Exámenes solicitados
    examenes: [],
    examenNombre: '',
    // Licencia médica
    licenciaOtorga: false,
    licenciaDias: '',
    licenciaNota: '',
  });
  const [errors, setErrors] = useState({});

  // Ref para enfocar el primer campo de medicamentos tras agregar
  const medNombreRef = useRef(null);

  // Mantener nombre/especialidad en store cuando cambie el usuario (opcional)
  useEffect(() => {
    if (!doctorName && !doctorSpecialty) return;
    // No mutamos todos en bloque, ya que el store emitirá y sincronizará en la suscripción superior
  }, [doctorName, doctorSpecialty]);

  const openModal = () => {
    // Evitar abrir si ya está completada
    if (consulta?.estado === 'Completado') {
      alert('Esta atención ya fue completada. Para realizar cambios, contacte al administrador.');
      return;
    }
    if (consulta) {
      setForm({
        observaciones: consulta.observaciones && consulta.observaciones !== '—' ? consulta.observaciones : '',
        presion: consulta?.vitals?.presion || '',
        temperatura: consulta?.vitals?.temperatura || '',
        pulso: consulta?.vitals?.pulso || '',
        proximoControl: consulta.proximoControl && consulta.proximoControl !== '—' ? consulta.proximoControl : '',
        recetaId: consulta.recetaId || '',
        medicamentos: (consulta.medicamentos || []).join('\n'),
        medicamentosDet: Array.isArray(consulta.medicamentosDet) ? consulta.medicamentosDet : [],
        medNombre: '',
        medDias: '',
        medFrecuencia: '',
        examenes: Array.isArray(consulta.examenes) ? consulta.examenes : [],
        examenNombre: '',
        licenciaOtorga: Boolean(consulta?.licencia?.otorga) || false,
        licenciaDias: consulta?.licencia?.dias || '',
        licenciaNota: consulta?.licencia?.nota || '',
      });
      setErrors({});
    }
    setOpen(true);
  };

  // Previsualización en vivo en el detalle: mezclar datos del formulario sobre la consulta activa cuando el modal está abierto
  const consultaPreview = useMemo(() => {
    if (!consulta) return null;
    if (!open) return consulta;
    return {
      ...consulta,
      observaciones: form.observaciones?.trim() || consulta.observaciones,
      proximoControl: form.proximoControl?.trim() || consulta.proximoControl,
      recetaId: form.recetaId?.trim() || consulta.recetaId,
      vitals: {
        presion: form.presion?.trim() || consulta?.vitals?.presion || null,
        temperatura: form.temperatura?.trim() || consulta?.vitals?.temperatura || null,
        pulso: form.pulso?.trim() || consulta?.vitals?.pulso || null,
      },
      medicamentos: [],
      medicamentosDet: Array.isArray(form.medicamentosDet) ? form.medicamentosDet : consulta.medicamentosDet,
      examenes: Array.isArray(form.examenes) ? form.examenes : consulta.examenes,
      licencia: {
        otorga: !!form.licenciaOtorga,
        dias: form.licenciaOtorga ? (Number(form.licenciaDias) || null) : null,
        nota: form.licenciaOtorga ? (form.licenciaNota || '') : '',
      },
      estado: consulta.estado,
    };
  }, [consulta, open, form]);
  const closeModal = () => setOpen(false);
  const validate = () => { const e = {}; setErrors(e); return true; };

  // Handler para agregar medicamento detallado y enfocarse en el siguiente
  const addMedicamento = () => {
    const nombre = form.medNombre?.trim();
    const dias = form.medDias ? Number(form.medDias) : null;
    const frecuencia = form.medFrecuencia?.trim();
    if (!nombre) return;
    const nuevo = { nombre, dias, frecuencia };
    setForm(prev => ({
      ...prev,
      medicamentosDet: [...(prev.medicamentosDet || []), nuevo],
      medNombre: '', medDias: '', medFrecuencia: ''
    }));
    // Reenfocar al primer input para ingresar una nueva línea
    setTimeout(() => { medNombreRef.current?.focus(); }, 0);
  };
  const handleSave = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    if (!activeId) return;
    const current = allItems.find(it => String(it.id) === String(activeId));
    if (!current) return;
    upsertAssignment({
      ...current,
      observaciones: form.observaciones?.trim() || '—',
      proximoControl: form.proximoControl?.trim() || '—',
      recetaId: form.recetaId?.trim() || null,
      vitals: { presion: form.presion?.trim() || null, temperatura: form.temperatura?.trim() || null, pulso: form.pulso?.trim() || null },
      medicamentos: [],
      medicamentosDet: Array.isArray(form.medicamentosDet) ? form.medicamentosDet : [],
      examenes: Array.isArray(form.examenes) ? form.examenes : [],
      licencia: { otorga: !!form.licenciaOtorga, dias: form.licenciaOtorga ? Number(form.licenciaDias) || null : null, nota: form.licenciaOtorga ? (form.licenciaNota || '') : '' },
      estado: 'Completado',
    });
    setOpen(false);
  };

  return (<>
    <div className="container-fluid">
      <div className="row g-3">
        {/* Nueva disposición: Timeline (izq), Detalle (centro) y Sidebar (der) */}
        <div className="col-12 col-lg-5 col-xl-4">
          <TimelineMedico items={todayItems} activeId={activeId} onSelect={setActiveId} onStart={openModal} />
        </div>
        <div className="col-12 col-lg-7 col-xl-5">
          <ConsultationDetailDoctor key={activeId || 'none'} consulta={consultaPreview} />
        </div>
        <div className="col-12 col-xl-3">
          {/* Panel del Médico (métricas) */}
          <div className="card">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Panel del Médico</h5>
              <span className="custom-badge border-success text-success">Beta</span>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-12">
                  <div className="p-3 border rounded bg-gray-100 d-flex align-items-center gap-3">
                    <i className="fas fa-calendar-check text-primary fa-lg" />
                    <div>
                      <p className="mb-0 small text-muted">Citas de hoy</p>
                      <p className="mb-0 fw-semibold">5</p>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="p-3 border rounded bg-gray-100 d-flex align-items-center gap-3">
                    <i className="fas fa-user-md text-success fa-lg" />
                    <div>
                      <p className="mb-0 small text-muted">Pacientes en sala</p>
                      <p className="mb-0 fw-semibold">2</p>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>

          {/* Agenda Próxima */}
          <div className="card mt-3">
            <div className="card-header bg-white">
              <h6 className="mb-0">Agenda Próxima</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0 small">
                <li className="d-flex justify-content-between py-2 border-bottom">
                  <span>10:00 - Juan Pérez</span>
                  <span className="text-muted">Consulta General</span>
                </li>
                <li className="d-flex justify-content-between py-2 border-bottom">
                  <span>10:30 - María Soto</span>
                  <span className="text-muted">Controles</span>
                </li>
                <li className="d-flex justify-content-between py-2">
                  <span>11:00 - Pedro Díaz</span>
                  <span className="text-muted">Resultados</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Notificaciones */}
          <div className="card mt-3">
            <div className="card-header bg-white">
              <h6 className="mb-0">Notificaciones</h6>
            </div>
            <div className="card-body">
              <ul className="list-unstyled mb-0 small">
                <li className="py-2 border-bottom d-flex align-items-center gap-2">
                  <i className="fas fa-info-circle text-primary" /> Nueva derivación recibida para revisión.
                </li>
                <li className="py-2 border-bottom d-flex align-items-center gap-2">
                  <i className="fas fa-shield-alt text-success" /> Sistema conectado de forma segura.
                </li>
                
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ModalAtencion
      open={open}
      onClose={closeModal}
      pacienteId={pacienteId}
      doctorId={doctorMedicoId || doctorUserId}
      citaId={activeId}
      onSaved={useCallback(
        (savedConsulta) => {
          // Actualizar la tarjeta activa en el store para reflejar inmediatamente
          if (activeId) {
            const current = allItems.find(it => String(it.id) === String(activeId));
            if (current) {
              upsertAssignment({
                ...current,
                estado: 'Completado',
                resumen: savedConsulta?.motivo || current.resumen,
                motivo: savedConsulta?.motivo || current.motivo,
                diagnostico: savedConsulta?.diagnostico || current.diagnostico,
                tratamiento: savedConsulta?.tratamiento || current.tratamiento,
                observaciones: savedConsulta?.observaciones || current.observaciones || '—',
                proximoControl: current.proximoControl || '—',
                vitals: current.vitals || { presion: null, temperatura: null, pulso: null },
                medicamentosDet: Array.isArray(savedConsulta?.receta?.medicamentos)
                  ? savedConsulta.receta.medicamentos.map(m => ({ nombre: m.nombre, dias: m.duracion, frecuencia: m.frecuencia }))
                  : (current.medicamentosDet || []),
                recetaId: savedConsulta?.receta ? (savedConsulta._id || '—') : current.recetaId || null,
              });
            }
          }
          setOpen(false);
          // Refrescar lista desde backend para sincronizar con otras sesiones
          fetchCitasHoy();
        },
        [allItems, activeId, upsertAssignment, fetchCitasHoy]
      )}
    />
  </>);
}
