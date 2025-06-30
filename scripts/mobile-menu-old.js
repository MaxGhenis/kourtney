function toggleMobileMenu() {
  const menu = document.getElementById('navbar-menu');
  menu.classList.toggle('show');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
  const menu = document.getElementById('navbar-menu');
  const toggle = document.querySelector('.mobile-menu-toggle');
  
  if (!menu.contains(event.target) && !toggle.contains(event.target)) {
    menu.classList.remove('show');
  }
});

// Close mobile menu when window is resized to desktop
window.addEventListener('resize', function() {
  if (window.innerWidth > 750) {
    const menu = document.getElementById('navbar-menu');
    menu.classList.remove('show');
  }
});