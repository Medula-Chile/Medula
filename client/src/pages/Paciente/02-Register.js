document.addEventListener('DOMContentLoaded', function() {
    // Validación básica del formulario
    document.getElementById('register-form').addEventListener('submit', function(e) {
        e.preventDefault();

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        alert('¡Registro exitoso! Bienvenido a Médula.');
    });

    // Modo oscuro
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggle.textContent = 'Modo claro';
        } else {
            darkModeToggle.textContent = 'Modo oscuro';
        }
    });
});