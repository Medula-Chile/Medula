document.addEventListener('DOMContentLoaded', function() {
  const navItems = document.querySelectorAll('.nav-item');
  const sections = document.querySelectorAll('.section');

  navItems.forEach(btn => {
    btn.addEventListener('click', function() {
      // Toggle active class on nav items
      navItems.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Get target from data-target attribute
      const target = btn.getAttribute('data-target');
      if (target) {
        // Toggle default class on sections
        sections.forEach(sec => sec.classList.remove('default'));
        const targetSection = document.getElementById(target);
        if (targetSection) {
          targetSection.classList.add('default');
        }
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      window.location.href = '../auth/login.html';
    });
  }
});

document.querySelectorAll('.view-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    let collapse = btn.nextElementSibling;
    if (!collapse || !collapse.classList.contains('collapse-detail')) {
      collapse = document.createElement('div');
      collapse.className = 'collapse-detail';
      btn.parentNode.insertBefore(collapse, btn.nextSibling);
    }
    if (collapse.style.display === 'none' || collapse.style.display === '') {
      fetch('../citas/cardhistorial.html')
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
});
