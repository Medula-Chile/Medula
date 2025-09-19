document.addEventListener('DOMContentLoaded', function() {
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

  // --- Logout buttons ---
  const logoutBtn = document.getElementById('logoutBtn');
  const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      alert('Función de cierre de sesión activada');
    });
  }
  if (sidebarLogoutBtn) {
    sidebarLogoutBtn.addEventListener('click', function() {
      alert('Función de cierre de sesión activada');
    });
  }

  // --- Data source (single source of truth) ---
  // Base dataset
  const medicamentos = [
    // ACTIVO (R-120)
    { id: 'R-120', nombre: 'Paracetamol', dosis: '500 mg', frecuencia: 'cada 8 horas x 3 días', inicio: '2025-09-01', estado: 'ACTIVO' },
    { id: 'R-120', nombre: 'Ibuprofeno',  dosis: '200 mg', frecuencia: 'cada 8 horas x 5 días', inicio: '2025-09-01', estado: 'ACTIVO' },
    { id: 'R-120', nombre: 'Omeprazol',   dosis: '20 mg',  frecuencia: 'cada 24 horas',         inicio: '2025-09-01', estado: 'ACTIVO' },
    // ACTIVO (R-555)
    { id: 'R-555', nombre: 'Vitamina D3', dosis: '1000 IU',frecuencia: 'cada 24 horas',         inicio: '2025-09-10', estado: 'ACTIVO' },

    // PENDIENTE (R-342)
    { id: 'R-342', nombre: 'Aspirina',    dosis: '100 mg', frecuencia: 'cada 12 horas',         inicio: '2025-09-01', estado: 'PENDIENTE' },
    { id: 'R-342', nombre: 'Metformina',  dosis: '850 mg', frecuencia: 'cada 12 horas x 5 días',inicio: '2025-08-01', estado: 'PENDIENTE' },

    // SUSPENDIDO (R-123)
    { id: 'R-123', nombre: 'Paracetamol', dosis: '500 mg', frecuencia: 'cada 8 horas x 5 días', inicio: '2025-09-01', estado: 'SUSPENDIDO' },
    { id: 'R-123', nombre: 'Amoxicilina', dosis: '500 mg', frecuencia: 'cada 8 horas',          inicio: '2025-09-01', estado: 'SUSPENDIDO' },
  ];

  // Expand to ~25 items with sample data (mix of estados and ids)
  const extra = [
    { id: 'R-777', nombre: 'Losartán', dosis: '50 mg', frecuencia: 'cada 24 horas', inicio: '2025-08-15', estado: 'ACTIVO' },
    { id: 'R-777', nombre: 'Hidroclorotiazida', dosis: '25 mg', frecuencia: 'cada 24 horas', inicio: '2025-08-15', estado: 'ACTIVO' },
    { id: 'R-888', nombre: 'Atorvastatina', dosis: '20 mg', frecuencia: 'cada 24 horas', inicio: '2025-07-20', estado: 'ACTIVO' },
    { id: 'R-888', nombre: 'Ezetimiba', dosis: '10 mg', frecuencia: 'cada 24 horas', inicio: '2025-07-20', estado: 'PENDIENTE' },
    { id: 'R-999', nombre: 'Levotiroxina', dosis: '100 mcg', frecuencia: 'cada 24 horas', inicio: '2025-06-10', estado: 'ACTIVO' },
    { id: 'R-222', nombre: 'Metoprolol', dosis: '50 mg', frecuencia: 'cada 12 horas', inicio: '2025-08-05', estado: 'PENDIENTE' },
    { id: 'R-333', nombre: 'Clopidogrel', dosis: '75 mg', frecuencia: 'cada 24 horas', inicio: '2025-04-01', estado: 'SUSPENDIDO' },
    { id: 'R-333', nombre: 'Amlodipino', dosis: '5 mg', frecuencia: 'cada 24 horas', inicio: '2025-04-01', estado: 'ACTIVO' },
    { id: 'R-444', nombre: 'Insulina NPH', dosis: '10 UI', frecuencia: '2 veces al día', inicio: '2025-03-11', estado: 'ACTIVO' },
    { id: 'R-444', nombre: 'Insulina Rápida', dosis: '6 UI', frecuencia: 'antes de comidas', inicio: '2025-03-11', estado: 'PENDIENTE' },
    { id: 'R-555', nombre: 'Calcio', dosis: '600 mg', frecuencia: 'cada 24 horas', inicio: '2025-09-10', estado: 'ACTIVO' },
    { id: 'R-666', nombre: 'Vitamina B12', dosis: '1 mg', frecuencia: 'semanal', inicio: '2025-08-25', estado: 'SUSPENDIDO' },
    { id: 'R-101', nombre: 'Salbutamol', dosis: '2 puff', frecuencia: 'SOS', inicio: '2025-09-05', estado: 'ACTIVO' },
    { id: 'R-102', nombre: 'Budesonida', dosis: '200 mcg', frecuencia: '2 veces al día', inicio: '2025-09-05', estado: 'PENDIENTE' },
    { id: 'R-103', nombre: 'Montelukast', dosis: '10 mg', frecuencia: 'noche', inicio: '2025-09-05', estado: 'ACTIVO' },
    { id: 'R-104', nombre: 'Azytromicina', dosis: '500 mg', frecuencia: 'cada 24 horas x 3 días', inicio: '2025-09-02', estado: 'SUSPENDIDO' },
    { id: 'R-105', nombre: 'Doxiciclina', dosis: '100 mg', frecuencia: 'cada 12 horas x 7 días', inicio: '2025-09-02', estado: 'PENDIENTE' },
    { id: 'R-106', nombre: 'Prednisona', dosis: '20 mg', frecuencia: 'cada 24 horas x 5 días', inicio: '2025-09-03', estado: 'ACTIVO' },
    { id: 'R-107', nombre: 'Ranitidina', dosis: '150 mg', frecuencia: 'cada 12 horas', inicio: '2025-08-30', estado: 'SUSPENDIDO' },
    { id: 'R-108', nombre: 'Loratadina', dosis: '10 mg', frecuencia: 'cada 24 horas', inicio: '2025-09-12', estado: 'ACTIVO' },
    { id: 'R-109', nombre: 'Cetirizina', dosis: '10 mg', frecuencia: 'cada 24 horas', inicio: '2025-09-12', estado: 'PENDIENTE' },
    { id: 'R-110', nombre: 'Fluconazol', dosis: '150 mg', frecuencia: 'dosis única', inicio: '2025-09-11', estado: 'SUSPENDIDO' },
    { id: 'R-111', nombre: 'Naproxeno', dosis: '500 mg', frecuencia: 'cada 12 horas', inicio: '2025-09-01', estado: 'ACTIVO' },
    { id: 'R-112', nombre: 'Diclofenaco', dosis: '50 mg', frecuencia: 'cada 8 horas', inicio: '2025-08-28', estado: 'PENDIENTE' },
    { id: 'R-113', nombre: 'Omeprazol', dosis: '20 mg', frecuencia: 'cada 24 horas', inicio: '2025-08-28', estado: 'ACTIVO' },
  ];
  // Merge extras
  medicamentos.push(...extra);

  const estadoOrder = { ACTIVO: 1, PENDIENTE: 2, INACTIVO: 3 };
  function ordenarPorEstado(arr) {
    return [...arr].sort((a, b) => (estadoOrder[a.estado] ?? 99) - (estadoOrder[b.estado] ?? 99));
  }
  function badgeClass(estado) {
    if (estado === 'ACTIVO') return 'bg-success';
    if (estado === 'PENDIENTE') return 'bg-warning text-dark';
    return 'bg-secondary'; // INACTIVO
  }
  function properCase(estado) {
    return estado.charAt(0) + estado.slice(1).toLowerCase();
  }

  // --- Pagination setup ---
  let currentPage = 1;
  const pageSize = 10; // 10 items per page

  const medsRows = document.getElementById('medsRows');
  const medsPagination = document.getElementById('medsPagination');
  const medsPageInfo = document.getElementById('medsPageInfo');

  // Normalize states: SUSPENDIDO -> INACTIVO
  const normalized = medicamentos.map((m) => ({
    ...m,
    estado: m.estado === 'SUSPENDIDO' ? 'INACTIVO' : m.estado,
  }));

  // Enforce limits: 7 ACTIVO, 2 PENDIENTE, rest INACTIVO
  let activeCount = 0;
  let pendingCount = 0;
  const constrained = normalized.map((m) => {
    if (m.estado === 'ACTIVO') {
      if (activeCount < 7) {
        activeCount++;
        return m;
      }
      return { ...m, estado: 'INACTIVO' };
    }
    if (m.estado === 'PENDIENTE') {
      if (pendingCount < 2) {
        pendingCount++;
        return m;
      }
      return { ...m, estado: 'INACTIVO' };
    }
    // INACTIVO remains
    return m;
  });

  const ordered = ordenarPorEstado(constrained);
  const totalItems = ordered.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  function bindIdLinks() {
    // Attach click handlers to recipe ID links
    document.querySelectorAll('.med-id-link').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const rid = a.getAttribute('data-id');
        // Placeholder navigation: adjust when Recetas view is ready
        // Example: window.location.href = `/recetas.html?id=${encodeURIComponent(rid)}`;
        console.log('Ir a receta:', rid);
      });
    });
  }

  function renderRows() {
    if (!medsRows) return;
    const start = (currentPage - 1) * pageSize;
    const end = Math.min(start + pageSize, totalItems);
    const slice = ordered.slice(start, end);
    medsRows.innerHTML = slice.map((m) => `
      <div class="row gx-2 align-items-center py-2 border-bottom">
        <div class="col-6 col-md-3"><span class="fw-medium">${m.nombre}</span></div>
        <div class="col-6 col-md-2">${m.dosis}</div>
        <div class="col-12 col-md-3 small text-muted d-none d-md-block">${m.frecuencia}</div>
        <div class="col-6 col-md-2 small text-muted d-none d-md-block">${m.inicio}</div>
        <div class="col-6 col-md-1 d-none d-md-block"><a href="#" class="med-id-link" data-id="${m.id}">${m.id}</a></div>
        <div class="col-6 col-md-1 d-none d-md-block text-end pe-2">
          <span class="badge ${badgeClass(m.estado)} me-1">${properCase(m.estado)}</span>
        </div>
        <div class="col-12 d-md-none small text-muted mt-1">${m.frecuencia} • ${m.inicio} • ${m.id} • ${properCase(m.estado)}</div>
      </div>
    `).join('');
    if (medsPageInfo) {
      medsPageInfo.textContent = `Mostrando ${start + 1}–${end} de ${totalItems}`;
    }
    bindIdLinks();
  }

  function renderPagination() {
    if (!medsPagination) return;
    const items = [];
    // Prev
    items.push(`<li class="page-item ${currentPage === 1 ? 'disabled' : ''}"><a class="page-link" href="#" data-page="prev">«</a></li>`);
    // Numbers
    for (let p = 1; p <= totalPages; p++) {
      items.push(`<li class="page-item ${p === currentPage ? 'active' : ''}"><a class="page-link" href="#" data-page="${p}">${p}</a></li>`);
    }
    // Next
    items.push(`<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}"><a class="page-link" href="#" data-page="next">»</a></li>`);
    medsPagination.innerHTML = items.join('');

    // Bind clicks
    medsPagination.querySelectorAll('a.page-link').forEach((a) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const token = a.getAttribute('data-page');
        if (token === 'prev' && currentPage > 1) currentPage--;
        else if (token === 'next' && currentPage < totalPages) currentPage++;
        else if (!isNaN(parseInt(token))) currentPage = parseInt(token);
        renderRows();
        renderPagination();
      });
    });
  }

  // Initial render
  renderRows();
  renderPagination();

  // --- Render active list card ---
  const activosCardBody = document.getElementById('activosCardBody');
  if (activosCardBody) {
    const activos = ordered.filter((m) => m.estado === 'ACTIVO').slice(0, 5);
    activosCardBody.innerHTML = activos.map((m) => `
      <div class="d-flex align-items-center gap-2 small mb-2">
        <i class="fas fa-pills text-success small"></i>
        <span>${m.nombre} ${m.dosis} <a href="#" class="med-id-link" data-id="${m.id}"><span class="text-muted">(${m.id})</span></a></span>
      </div>
    `).join('');
    bindIdLinks();
  }

  // --- Legacy click behavior for consultation items (if present) ---
  const consultationItems = document.querySelectorAll('.consultation-item');
  consultationItems.forEach(item => {
    item.addEventListener('click', function() {
      consultationItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
});