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

    // Manejo de botones para ver recetas
    document.querySelectorAll('.eye-icon-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const imageName = this.getAttribute('image');
            console.log('Imagen a mostrar:', imageName); // Para debugging

            if (imageName) {
                Swal.fire({
                    title: 'Receta Médica',
                    imageUrl: `../../components/recetas/imágenes/${imageName}`,
                    imageAlt: 'Receta Médica',
                    confirmButtonText: 'Cerrar',
                    width: 600,
                    showCloseButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        console.log('Modal cerrado');
                    }
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se encontró la receta.',
                });
            }
        });
    });
});