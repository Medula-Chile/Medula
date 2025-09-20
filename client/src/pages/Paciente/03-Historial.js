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

    // Toggle sidebar on mobile
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('show');
        sidebarOverlay.classList.toggle('show');
    });
    
    sidebarOverlay.addEventListener('click', function() {
        sidebar.classList.remove('show');
        sidebarOverlay.classList.remove('show');
    });
    
    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', function() {
        alert('Función de cierre de sesión activada');
    });
    
    document.getElementById('sidebarLogoutBtn').addEventListener('click', function() {
        alert('Función de cierre de sesión activada');
    });
    
    // Consultation items click
    const consultationItems = document.querySelectorAll('.consultation-item');
    consultationItems.forEach(item => {
        item.addEventListener('click', function() {
            consultationItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
        });
    });
});