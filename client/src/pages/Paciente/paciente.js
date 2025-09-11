
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('show-historial-btn');
  const collapse = document.getElementById('collapse-historial');
  if (btn && collapse) {
    btn.addEventListener('click', function() {
      if (collapse.style.display === 'none' || collapse.style.display === '') {
        fetch('../../components/citas/cardhistorial.html')
          .then(response => response.text())
          .then(html => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const timeline = tempDiv.querySelector('.timeline-container');
            collapse.innerHTML = timeline ? timeline.outerHTML : html;
            collapse.style.display = 'block';
          })
          .catch(() => {
            collapse.innerHTML = '<div class="alert alert-danger">No se pudo cargar el historial médico.</div>';
            collapse.style.display = 'block';
          });
      } else {
        collapse.style.display = 'none';
      }
    });
  }

  // Handle nav-item clicks
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(btn => {
    btn.addEventListener('click', function() {
      // Toggle active class on nav items
      navItems.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Get redirect from data-redirect attribute
      const redirect = btn.getAttribute('data-redirect');
      if (redirect) {
        window.location.href = redirect;
      }
    });
  });

  // Logout buttons
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      window.location.href = '../../components/auth/login.html';
    });
  }

  const sidebarLogout = document.getElementById('sidebar-logout');
  if (sidebarLogout) {
    sidebarLogout.addEventListener('click', function() {
      window.location.href = '../../components/auth/login.html';
    });
  }
});
