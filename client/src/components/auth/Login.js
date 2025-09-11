document.addEventListener('DOMContentLoaded', function() {
    // Alternar botones tipo usuario: solo visual
    const pacienteBtn = document.getElementById('paciente-btn');
    const medicoBtn = document.getElementById('medico-btn');

    pacienteBtn.addEventListener('click', () => {
        pacienteBtn.classList.add('selected');
        pacienteBtn.setAttribute('aria-pressed', 'true');
        medicoBtn.classList.remove('selected');
        medicoBtn.setAttribute('aria-pressed', 'false');
    });
    medicoBtn.addEventListener('click', () => {
        medicoBtn.classList.add('selected');
        medicoBtn.setAttribute('aria-pressed', 'true');
        pacienteBtn.classList.remove('selected');
        pacienteBtn.setAttribute('aria-pressed', 'false');
    });

    // Validación básica del formulario
    document.querySelector('form').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Por favor, ingresa un correo electrónico válido.');
            return;
        }
        if (!password) {
            alert('Por favor, ingresa tu contraseña.');
            return;
        }
        // Si todo está correcto, redirige al portal del paciente
        window.location.href = window.location.href.replace('/components/auth/login.html', '/pages/Paciente/paciente.html');

        alert('¡Inicio de sesión exitoso! Bienvenido a Médula.');
    });

    // Modo oscuro
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.textContent = 'Modo claro';
        } else {
            darkModeToggle.textContent = 'Modo oscuro';
        }
    });
});