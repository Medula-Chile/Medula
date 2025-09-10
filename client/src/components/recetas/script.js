// Script para manejar la navegación entre secciones
        document.addEventListener('DOMContentLoaded', function() {
            const navButtons = document.querySelectorAll('.nav-btn');
            const sectionContents = document.querySelectorAll('.section-content');
            
            navButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const sectionId = button.getAttribute('data-section');
                    
                    // Remover clase active de todos los botones y contenidos
                    navButtons.forEach(btn => btn.classList.remove('active'));
                    sectionContents.forEach(content => content.classList.remove('active'));
                    
                    // Agregar clase active al botón clickeado
                    button.classList.add('active');
                    
                    // Mostrar el contenido correspondiente
                    document.getElementById(sectionId).classList.add('active');
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
    const prescriptionImage = document.createElement('imagen');
    prescriptionImage.alt = 'Receta Médica';
    prescriptionImage.className = 'prescription-image'; // Use CSS class for styling

    document.body.appendChild(prescriptionImage);

    eyeIcons.forEach(icon => {
        icon.addEventListener('click', function(event) {
            event.stopPropagation();
            console.log('Eye icon clicked');
            const imageName = this.getAttribute('imagen')  // Default if no data-image
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


