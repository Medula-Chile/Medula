document.addEventListener('DOMContentLoaded', function() {
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
