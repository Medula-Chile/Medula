document.addEventListener('DOMContentLoaded', function() {
  // Mode banner
  const modeBanner = document.getElementById('modeBanner');
  const USE_API = Boolean(window.__USE_API);
  if (modeBanner) {
    if (USE_API) {
      modeBanner.classList.remove('alert-secondary');
      modeBanner.classList.add('alert-success');
      modeBanner.textContent = 'Conectado al backend: algunas funciones se sincronizan con el servidor.';
    } else {
      modeBanner.classList.remove('alert-success');
      modeBanner.classList.add('alert-secondary');
      modeBanner.textContent = 'Modo demo (sin backend): datos de prueba renderizados localmente.';
    }
    modeBanner.style.display = 'block';
  }
  // --- Sidebar mobile toggle ---
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebarToggle && sidebar && sidebarOverlay) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('show');
      sidebarOverlay.classList.toggle('show');
    });
    sidebarOverlay.addEventListener('click', function() {
      sidebar.classList.remove('show');
      sidebarOverlay.classList.remove('show');
    });
  }

  // --- Logout functionality ---
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      alert('Función de cierre de sesión activada');
    });
  }
  const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');
  if (sidebarLogoutBtn) {
    sidebarLogoutBtn.addEventListener('click', function() {
      alert('Función de cierre de sesión activada');
    });
  }

  // --- Source of truth for recipes ---
  // IDs y medicamentos consistentes con 04-Medicamentos.js
  // Doctores y centros tomados de 03-Historial.html
  const recetas = [
    {
      id: 'R-120',
      fecha: '2024-08-15',
      fechaLabel: '15 Ago 2024',
      doctor: 'Dr. Ana Silva',
      centro: 'CESFAM Norte',
      status: 'Vigente',
      validaHasta: '15 Sep 2024',
      notas: 'Tomar según indicación. Evitar duplicidad con otros analgésicos.',
      meds: [
        { nombre: 'Paracetamol', dosis: '500 mg', frecuencia: 'cada 8 horas' },
        { nombre: 'Ibuprofeno', dosis: '200 mg', frecuencia: 'cada 8 horas' },
        { nombre: 'Omeprazol', dosis: '20 mg', frecuencia: 'cada 24 horas' },
      ],
    },
    {
      id: 'R-342',
      fecha: '2024-07-02',
      fechaLabel: '02 Jul 2024',
      doctor: 'Dr. Carlos Mendoza',
      centro: 'Hospital Regional',
      status: 'Vigente',
      validaHasta: '02 Oct 2024',
      notas: 'Controlar glicemias al iniciar tratamiento y registrar adherencia.',
      meds: [
        { nombre: 'Aspirina', dosis: '100 mg', frecuencia: 'cada 12 horas' },
        { nombre: 'Metformina', dosis: '850 mg', frecuencia: 'cada 12 horas' },
      ],
    },
    {
      id: 'R-555',
      fecha: '2024-05-18',
      fechaLabel: '18 May 2024',
      doctor: 'Dr. Roberto Sánchez',
      centro: 'Hospital El Salvador',
      status: 'Vencida',
      validaHasta: '18 Jun 2024',
      notas: 'Continuar solo si es indicado en próximo control.',
      meds: [
        { nombre: 'Vitamina D3', dosis: '1000 IU', frecuencia: 'cada 24 horas' },
        { nombre: 'Calcio', dosis: '600 mg', frecuencia: 'cada 24 horas' },
      ],
    },
  ];

  // --- Rendering helpers ---
  const recipesList = document.getElementById('recipesList');
  const recipeTitle = document.getElementById('recipeTitle');
  const recipeStatus = document.getElementById('recipeStatus');
  const recipeNotes = document.getElementById('recipeNotes');
  const recipeDoctor = document.getElementById('recipeDoctor');
  const recipeCenter = document.getElementById('recipeCenter');
  const recipeFolio = document.getElementById('recipeFolio');
  const recipeValidUntil = document.getElementById('recipeValidUntil');
  const recipeMeds = document.getElementById('recipeMeds');
  const recipeStart = document.getElementById('recipeStart');
  const btnVerify = document.getElementById('btnVerify');
  const btnDownload = document.getElementById('btnDownload');
  const recipeVrfCode = document.getElementById('recipeVrfCode');
  const recipePatientName = document.getElementById('recipePatientName');
  const recipePatientId = document.getElementById('recipePatientId');
  const recipePrintArea = document.getElementById('recipePrintArea');

  // Demo patient data (reemplazar con datos reales cuando estén disponibles)
  const paciente = {
    nombre: 'María Elena Contreras',
    id: 'RUN 12.345.678-9',
  };

  function statusBadgeClass(status) {
    if (status === 'Vigente') return 'custom-badge border-success text-white bg-success';
    if (status === 'Pendiente') return 'custom-badge border-warning text-dark bg-warning';
    return 'custom-badge border-secondary text-white bg-secondary';
  }

  function renderList(selectedId) {
    if (!recipesList) return;
    recipesList.innerHTML = recetas.map((r) => `
      <div class="consultation-item ${r.id === selectedId ? 'active' : ''}" data-id="${r.id}">
        <div class="d-flex gap-3">
          <div class="bg-primary-10 rounded-circle p-2 flex-shrink-0">
            <i class="fas fa-file-prescription text-primary"></i>
          </div>
          <div class="flex-grow-1 min-w-0">
            <div class="d-flex justify-content-between align-items-start mb-1">
              <div class="flex-grow-1 min-w-0">
                <h6 class="fw-medium mb-0">Receta ${r.id}</h6>
                <p class="text-muted-foreground small mb-0">Emitida por ${r.doctor}</p>
              </div>
              <span class="text-muted-foreground small fw-medium ms-2">${r.fechaLabel}</span>
            </div>
            <p class="text-muted-foreground small mb-1">${r.centro}</p>
            <p class="small line-clamp-2 mb-0">${r.meds.map(m => `${m.nombre} ${m.dosis}`).join(' • ')}</p>
          </div>
        </div>
      </div>
    `).join('');

    // Bind selection
    recipesList.querySelectorAll('.consultation-item').forEach((item) => {
      item.addEventListener('click', () => {
        const rid = item.getAttribute('data-id');
        renderList(rid);
        const recipe = recetas.find(r => r.id === rid);
        renderDetail(recipe);
      });
    });
  }

  function renderDetail(r) {
    if (!r) return;
    // Title as 'Receta <ID>'
    if (recipeTitle) recipeTitle.textContent = `Receta ${r.id}`;
    if (recipeStatus) {
      recipeStatus.className = statusBadgeClass(r.status);
      recipeStatus.textContent = r.status;
    }
    if (recipeNotes) recipeNotes.textContent = r.notas;
    if (recipeDoctor) recipeDoctor.textContent = r.doctor;
    if (recipeCenter) recipeCenter.textContent = r.centro;
    if (recipeFolio) recipeFolio.textContent = r.id;
    if (recipeValidUntil) recipeValidUntil.textContent = r.validaHasta;
    if (recipeStart) recipeStart.textContent = r.fechaLabel;
    if (recipePatientName) recipePatientName.textContent = paciente.nombre;
    if (recipePatientId) recipePatientId.textContent = paciente.id;
    if (recipeMeds) {
      recipeMeds.innerHTML = r.meds.map((m) => `
        <div class="d-flex align-items-center gap-2 p-2 bg-gray-100 rounded">
          <i class="fas fa-pills text-success"></i>
          <span class="small">${m.nombre} ${m.dosis} <span class="text-muted">• ${m.frecuencia || ''}</span></span>
        </div>
      `).join('');
    }
    // Update verification code visible on screen
    if (recipeVrfCode) {
      const code = computeVerificationCode(r);
      recipeVrfCode.textContent = code;
    }
  }

  // Read ?folio=ID from URL to preselect a recipe
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function selectFromQuery() {
    const folio = getQueryParam('folio');
    if (!folio) return false;
    const found = recetas.find(r => r.id === folio);
    if (!found) return false;
    renderList(found.id);
    renderDetail(found);
    return true;
  }

  // Verify and Download handlers
  function computeVerificationCode(r) {
    // Simple illustrative code based on id and fecha
    const raw = `${r.id}|${r.fecha}`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash |= 0;
    }
    return `VRF-${Math.abs(hash).toString(16).toUpperCase()}`;
  }

  function bindDetailActions(current) {
    if (btnVerify) {
      btnVerify.onclick = () => {
        const code = computeVerificationCode(current);
        alert(`Receta ${current.id}\nEstado: ${current.status}\nEmitida: ${current.fechaLabel}\nVálida hasta: ${current.validaHasta}\nCódigo de verificación: ${code}`);
      };
    }
    if (btnDownload) {
      btnDownload.onclick = () => {
        // Imprimir solo el área de la receta
        if (!recipePrintArea) return window.print();
        const original = document.body.innerHTML;
        const printHtml = recipePrintArea.outerHTML;
        document.body.innerHTML = printHtml;
        window.print();
        document.body.innerHTML = original;
        window.location.reload();
      };
    }
  }

  // Wrap renderDetail to also bind actions
  const _renderDetail = renderDetail;
  renderDetail = function(r) {
    _renderDetail(r);
    bindDetailActions(r);
  };

  // Initial render
  const initialId = recetas[0]?.id;
  renderList(initialId);
  renderDetail(recetas[0]);
  // If a folio is provided, override selection
  selectFromQuery();
});