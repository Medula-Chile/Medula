// Script para manejar la navegación entre secciones
      document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.eye-icon-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const imageName = btn.getAttribute('image');
            if (imageName) {
                Swal.fire({
                    title: 'Receta Médica',
                    imageUrl: '../../components/recetas/imágenes/' + encodeURIComponent(imageName),
                    imageAlt: 'Receta Médica',
                    confirmButtonText: 'Cerrar',
                    width: 600
                });
            } else {
                Swal.fire('No se encontró la receta.');
            }
        });
    });
});
function aceptarDescargable() {
    Swal.fire({
        title: 'Solicitud de Descarga',
        text: 'Se generará una solicitud de descarga de receta, ¿Desea aceptar?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // Aquí puedes agregar la lógica para procesar la solicitud de descarga
            Swal.fire('Solicitud Enviada', 'La solicitud de descarga ha sido enviada exitosamente.', 'success');
        }
    });
}

// Toggle prescription image display on eye icon click and hide on outside click
document.addEventListener('DOMContentLoaded', function() {
    const eyeIcons = document.querySelectorAll('.eye-icon-btn');
    const prescriptionImage = document.createElement('img');
    prescriptionImage.alt = 'Receta Médica';
    prescriptionImage.className = 'prescription-image'; // Use CSS class for styling

    document.body.appendChild(prescriptionImage);

    eyeIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            event.stopPropagation();
            console.log('Eye icon clicked');
            const imageName = this.getAttribute('image')  // Default if no data-image
            const imageSrc = window.location.origin + window.location.pathname.replace(/[^\/]*$/, '') + 'imageName/' + encodeURIComponent(imageName);
            prescriptionImage.src = imageSrc;
            prescriptionImage.classList.add('show'); // Add the 'show' class
            console.log('Image src set to: ' + imageSrc);
        });
    });

    prescriptionImage.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    document.addEventListener('click', function() {
        prescriptionImage.classList.remove('show'); // Hide by removing the 'show' class
    });
});



// Modal Alert Functions
function showModalAlert(title, message) {
    const modal = document.getElementById('modalAlert');
    const modalTitle = document.getElementById('modalAlertTitle');
    const modalDesc = document.getElementById('modalAlertDesc');

    modalTitle.textContent = title;
    modalDesc.textContent = message;

    modal.classList.add('show');
    modal.focus(); // Focus for accessibility
}

function hideModalAlert() {
    const modal = document.getElementById('modalAlert');
    modal.classList.remove('show');
}

// Event listener for close button
document.getElementById('modalAlertCloseBtn').addEventListener('click', hideModalAlert);

// Close modal on overlay click
document.getElementById('modalAlert').addEventListener('click', function(event) {
    if (event.target === this) {
        hideModalAlert();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        hideModalAlert();
    }
});
// boton de cerrar sesion a incio seccion 
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    const sidebarLogoutBtn = document.getElementById('sidebar-logout');

    function goToLogin() {
        window.location.href = '../../pages/Paciente/paciente.html';
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', goToLogin);
    }
    if (sidebarLogoutBtn) {
        sidebarLogoutBtn.addEventListener('click', goToLogin);
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Toggle lateral nav buttons
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section-content');
    
    navItems.forEach(btn => {
        btn.addEventListener('click', function() {
            // Toggle color
            navItems.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Navegación interna
            const target = btn.getAttribute('data-section');
            if (target) {
                if (target === 'historial_medico') {
                    // Redirigir a la página de historial médico
                    window.location.href = '../../components/historial_medico/historial_medico.html';
                } else {
                    sections.forEach(sec => sec.classList.remove('active'));
                    const targetSection = document.getElementById(target);
                    if (targetSection) {
                        targetSection.classList.add('active');
                    }
                }
            }
        });
    });

    // ...tu código existente para logout y otras funciones...
});
