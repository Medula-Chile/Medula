document.addEventListener('DOMContentLoaded', function() {
  // --- Sidebar toggle ---
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

  // --- Mode banner ---
  const modeBanner = document.getElementById('modeBanner');
  const USE_API = Boolean(window.__USE_API);
  if (modeBanner) {
    if (USE_API) {
      modeBanner.classList.remove('alert-secondary');
      modeBanner.classList.add('alert-success');
      modeBanner.textContent = 'Conectado al backend: configuración puede sincronizarse con el servidor.';
    } else {
      modeBanner.classList.remove('alert-success');
      modeBanner.classList.add('alert-secondary');
      modeBanner.textContent = 'Modo demo (sin backend): configuración guardada localmente.';
    }
    modeBanner.style.display = 'block';
  }

  // --- Elements
  const inNotifEmail = document.getElementById('inNotifEmail');
  const inNotifSMS = document.getElementById('inNotifSMS');
  const inTheme = document.getElementById('inTheme');
  const inLang = document.getElementById('inLang');
  const inUseApi = document.getElementById('inUseApi');
  const btnClearLocal = document.getElementById('btnClearLocal');
  const btnLogoutCurrent = document.getElementById('btnLogoutCurrent');
  const btnLogoutAll = document.getElementById('btnLogoutAll');

  // --- Load/save helpers
  const SETTINGS_KEY = 'configSettings';
  function loadSettings() {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {}; } catch { return {}; }
  }
  function saveSettings(s) {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch {}
  }

  let settings = loadSettings();

  // --- Prefill
  if (inNotifEmail) inNotifEmail.checked = Boolean(settings.notifEmail);
  if (inNotifSMS) inNotifSMS.checked = Boolean(settings.notifSMS);
  if (inTheme) inTheme.value = settings.theme || 'system';
  if (inLang) inLang.value = settings.lang || 'es';
  if (inUseApi) inUseApi.checked = USE_API;

  // --- Handlers
  inNotifEmail && inNotifEmail.addEventListener('change', () => { settings.notifEmail = inNotifEmail.checked; saveSettings(settings); });
  inNotifSMS && inNotifSMS.addEventListener('change', () => { settings.notifSMS = inNotifSMS.checked; saveSettings(settings); });
  inTheme && inTheme.addEventListener('change', () => { settings.theme = inTheme.value; saveSettings(settings); applyTheme(inTheme.value); });
  inLang && inLang.addEventListener('change', () => { settings.lang = inLang.value; saveSettings(settings); });
  inUseApi && inUseApi.addEventListener('change', () => {
    // Persist preference for next load; actual flag is provided by layout/script global
    settings.useApiPref = inUseApi.checked;
    saveSettings(settings);
    alert('Reinicia la página para aplicar el cambio de modo.');
  });

  btnClearLocal && btnClearLocal.addEventListener('click', () => {
    if (confirm('¿Seguro que quieres limpiar los datos locales (localStorage)?')) {
      localStorage.clear();
      location.reload();
    }
  });

  btnLogoutCurrent && btnLogoutCurrent.addEventListener('click', () => {
    alert('Cerrar sesión en este dispositivo (implementar con backend).');
  });
  btnLogoutAll && btnLogoutAll.addEventListener('click', () => {
    alert('Cerrar sesión en todos los dispositivos (implementar con backend).');
  });

  // --- Apply theme helper
  function applyTheme(theme) {
    const html = document.documentElement;
    html.removeAttribute('data-bs-theme');
    if (theme === 'dark') html.setAttribute('data-bs-theme', 'dark');
    if (theme === 'light') html.setAttribute('data-bs-theme', 'light');
  }
  applyTheme(inTheme ? inTheme.value : 'system');
});