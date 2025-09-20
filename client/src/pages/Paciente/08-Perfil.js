document.addEventListener('DOMContentLoaded', function() {
  // --- Config API (enable when backend is ready) ---
  const API_BASE = '/api';
  const USE_API = Boolean(window.__USE_API); // Set window.__USE_API = true to enable API mode

  // --- Sidebar mobile toggle ---
  const sidebar = document.getElementById('sidebar');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const sidebarToggle = document.getElementById('sidebarToggle');
  if (sidebar && sidebarOverlay && sidebarToggle) {
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

  // --- Minimal profile dataset (replace with real user data when available) ---
  const defaultProfile = {
    nombre: 'María Elena Contreras',
    run: '12.345.678-9',
    nacimiento: '1988-06-14',
    fonasa: 'FONASA B',
    sangre: 'O+',
    telefono: '+56 9 1234 5678',
    email: 'maria.contreras@example.com',
    direccion: 'Calle 123, Ñuñoa, Santiago',
    emergNombre: 'Juan Contreras',
    emergRelacion: 'Hermano',
    emergTelefono: '+56 9 9876 5432'
  };

  function loadProfile() {
    try {
      const raw = localStorage.getItem('perfilPaciente');
      return raw ? JSON.parse(raw) : { ...defaultProfile };
    } catch {
      return { ...defaultProfile };
    }
  }

  function saveProfile(p) {
    try { localStorage.setItem('perfilPaciente', JSON.stringify(p)); } catch {}
  }

  // --- API helpers ---
  async function apiGetProfile() {
    const res = await fetch(`${API_BASE}/patient/profile`, { credentials: 'include' });
    if (!res.ok) throw new Error('No se pudo obtener el perfil');
    return await res.json();
  }

  async function apiPutProfile(payload) {
    const res = await fetch(`${API_BASE}/patient/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('No se pudo actualizar el perfil');
    return await res.json();
  }

  // --- Bind preview fields ---
  const pfNombre = document.getElementById('pfNombre');
  const pfRun = document.getElementById('pfRun');
  const pfNacimiento = document.getElementById('pfNacimiento');
  const pfTelefono = document.getElementById('pfTelefono');
  const pfEmail = document.getElementById('pfEmail');
  const pfDireccion = document.getElementById('pfDireccion');
  const pfFonasa = document.getElementById('pfFonasa');
  const pfSangre = document.getElementById('pfSangre');
  const pfEmergNombre = document.getElementById('pfEmergNombre');
  const pfEmergRelacion = document.getElementById('pfEmergRelacion');
  const pfEmergTelefono = document.getElementById('pfEmergTelefono');

  let perfil = { ...defaultProfile };

  function renderProfile() {
    if (pfNombre) pfNombre.textContent = perfil.nombre;
    if (pfRun) pfRun.textContent = perfil.run;
    if (pfNacimiento) pfNacimiento.textContent = new Date(perfil.nacimiento).toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: '2-digit' });
    if (pfFonasa) pfFonasa.textContent = perfil.fonasa || '—';
    if (pfSangre) pfSangre.textContent = perfil.sangre || '—';
    if (pfTelefono) pfTelefono.textContent = perfil.telefono;
    if (pfEmail) pfEmail.textContent = perfil.email;
    if (pfDireccion) pfDireccion.textContent = perfil.direccion;
    if (pfEmergNombre) pfEmergNombre.textContent = perfil.emergNombre || '—';
    if (pfEmergRelacion) pfEmergRelacion.textContent = perfil.emergRelacion || '—';
    if (pfEmergTelefono) pfEmergTelefono.textContent = perfil.emergTelefono || '—';
  }

  async function initProfile() {
    try {
      if (USE_API) {
        const apiProfile = await apiGetProfile();
        perfil = { ...defaultProfile, ...apiProfile };
      } else {
        perfil = loadProfile();
      }
    } catch (e) {
      alert('No se pudo cargar el perfil. Usando datos locales.');
      perfil = loadProfile();
    }
    renderProfile();
    // Mode banner
    const banner = document.getElementById('profileModeBanner');
    if (banner) {
      if (USE_API) {
        banner.classList.remove('alert-secondary');
        banner.classList.add('alert-success');
        banner.textContent = 'Conectado al backend: los datos se están sincronizando con el servidor.';
      } else {
        banner.classList.remove('alert-success');
        banner.classList.add('alert-secondary');
        banner.textContent = 'Modo demo (sin backend): los cambios se guardan localmente.';
      }
      banner.style.display = 'block';
    }
  }

  initProfile();

  // --- Edit modal handlers ---
  const btnEditProfile = document.getElementById('btnEditProfile');
  const btnSaveProfile = document.getElementById('btnSaveProfile');
  const inTelefono = document.getElementById('inTelefono');
  const inEmail = document.getElementById('inEmail');
  const inDireccion = document.getElementById('inDireccion');
  // Optional: additional inputs if present in modal (could be added later)
  const inFonasa = document.getElementById('inFonasa');
  const inEmergNombre = document.getElementById('inEmergNombre');
  const inEmergRelacion = document.getElementById('inEmergRelacion');
  const inEmergTelefono = document.getElementById('inEmergTelefono');
  const inSangre = document.getElementById('inSangre');

  let editModalInstance = null;
  const modalEl = document.getElementById('editProfileModal');
  if (modalEl) {
    editModalInstance = new bootstrap.Modal(modalEl);
  }

  if (btnEditProfile && editModalInstance) {
    btnEditProfile.addEventListener('click', () => {
      if (inTelefono) inTelefono.value = perfil.telefono || '';
      if (inEmail) inEmail.value = perfil.email || '';
      if (inDireccion) inDireccion.value = perfil.direccion || '';
      if (inFonasa) inFonasa.value = perfil.fonasa || '';
      if (inEmergNombre) inEmergNombre.value = perfil.emergNombre || '';
      if (inEmergRelacion) inEmergRelacion.value = perfil.emergRelacion || '';
      if (inEmergTelefono) inEmergTelefono.value = perfil.emergTelefono || '';
      if (inSangre) inSangre.value = perfil.sangre || 'O+';
      editModalInstance.show();
    });
  }

  if (btnSaveProfile && editModalInstance) {
    btnSaveProfile.addEventListener('click', () => {
      // Strict validation
      const tel = inTelefono ? inTelefono.value.trim() : '';
      const mail = inEmail ? inEmail.value.trim() : '';
      const dir = inDireccion ? inDireccion.value.trim() : '';
      const fon = inFonasa ? inFonasa.value.trim() : perfil.fonasa;
      const enom = inEmergNombre ? inEmergNombre.value.trim() : perfil.emergNombre;
      const erel = inEmergRelacion ? inEmergRelacion.value.trim() : perfil.emergRelacion;
      const etel = inEmergTelefono ? inEmergTelefono.value.trim() : perfil.emergTelefono;
      const sangre = inSangre ? inSangre.value : perfil.sangre;

      // Chile phone: +56 9 XXXX XXXX (allow spaces or no spaces)
      const phoneRe = /^\+56\s?9\s?\d{4}\s?\d{4}$/;
      // Basic email regex (RFC compliant-enough for UI)
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      const addressValid = dir.length >= 8;

      // Reset classes
      [inTelefono, inEmail, inDireccion, inEmergTelefono].forEach((el) => { if (el) el.classList.remove('is-invalid'); });

      let firstInvalid = null;
      if (!phoneRe.test(tel)) {
        inTelefono && inTelefono.classList.add('is-invalid');
        firstInvalid = firstInvalid || inTelefono;
      }
      if (!emailRe.test(mail)) {
        inEmail && inEmail.classList.add('is-invalid');
        firstInvalid = firstInvalid || inEmail;
      }
      if (!addressValid) {
        inDireccion && inDireccion.classList.add('is-invalid');
        firstInvalid = firstInvalid || inDireccion;
      }
      // Emergency phone uses same Chile pattern
      if (inEmergTelefono && etel && !phoneRe.test(etel)) {
        inEmergTelefono.classList.add('is-invalid');
        firstInvalid = firstInvalid || inEmergTelefono;
      }

      if (firstInvalid) {
        firstInvalid.focus();
        return; // Do not proceed
      }

      perfil = { ...perfil, telefono: tel, email: mail, direccion: dir, fonasa: fon, sangre, emergNombre: enom, emergRelacion: erel, emergTelefono: etel };
      (async () => {
        try {
          if (USE_API) {
            const updated = await apiPutProfile(perfil);
            perfil = { ...perfil, ...updated };
          } else {
            saveProfile(perfil);
          }
          renderProfile();
          editModalInstance.hide();
        } catch (e) {
          alert('No se pudo guardar el perfil. Intenta nuevamente.');
        }
      })();
    });
  }

  // --- Keep existing sample list selection behavior (if present) ---
  const consultationItems = document.querySelectorAll('.consultation-item');
  consultationItems.forEach(item => {
    item.addEventListener('click', function() {
      consultationItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
});