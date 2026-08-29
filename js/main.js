/* ==============================================
   A-COO Edu Consults — Main JavaScript
   ============================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Mobile Nav ---- */
  const toggle = document.getElementById('nav-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileClose = document.getElementById('mobile-close');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }
  if (mobileClose && mobileNav) {
    mobileClose.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
  // Mobile dropdowns
  document.querySelectorAll('.mobile-nav-group-label').forEach(label => {
    label.addEventListener('click', () => {
      label.parentElement.classList.toggle('open');
    });
  });

  /* ---- Back to Top ---- */
  const backTop = document.getElementById('back-to-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) backTop.classList.add('visible');
      else backTop.classList.remove('visible');
    });
    backTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---- Scroll Animations ---- */
  const animEls = document.querySelectorAll('.fade-up, .fade-in');
  if (animEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    animEls.forEach(el => observer.observe(el));
  }

  /* ---- Stats Counter ---- */
  const stats = document.querySelectorAll('.stat-number[data-target]');
  if (stats.length) {
    const statObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          statObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach(el => statObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const startTime = performance.now();
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  /* ---- Testimonial Dots ---- */
  const track = document.getElementById('testimonials-track');
  const dots = document.querySelectorAll('.testimonials-dot');
  if (track && dots.length) {
    const cards = track.querySelectorAll('.testimonial-card');
    let active = 0;

    function setDot(index) {
      dots.forEach((d, i) => d.classList.toggle('active', i === index));
      active = index;
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        if (cards[i]) {
          cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          setDot(i);
        }
      });
    });

    // Auto scroll testimonials
    let autoInterval = setInterval(() => {
      const next = (active + 1) % dots.length;
      if (cards[next]) {
        cards[next].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        setDot(next);
      }
    }, 4500);

    track.addEventListener('mouseenter', () => clearInterval(autoInterval));
    track.addEventListener('mouseleave', () => {
      autoInterval = setInterval(() => {
        const next = (active + 1) % dots.length;
        if (cards[next]) {
          cards[next].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
          setDot(next);
        }
      }, 4500);
    });
  }

  /* ---- Team Avatar Fallback ---- */
  document.querySelectorAll('.team-card-photo img').forEach(img => {
    img.addEventListener('error', () => {
      const parent = img.parentElement;
      const name = img.alt || 'Team Member';
      const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      const colors = ['#0f5fb6','#21b24f','#ef7d2c','#17224D','#6c3483','#16a085','#e74c3c','#2980b9'];
      const color = colors[Math.abs(name.split('').reduce((a,c) => a + c.charCodeAt(0), 0)) % colors.length];
      img.style.display = 'none';
      const avatar = document.createElement('div');
      avatar.className = 'team-photo-avatar';
      avatar.style.background = color + '22';
      avatar.style.color = color;
      avatar.textContent = initials;
      parent.appendChild(avatar);
    });
  });

  /* ---- Active Nav Link ---- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPage || href.endsWith(currentPage))) {
      link.classList.add('active');
    }
  });

  /* ---- Smooth Scroll for anchor links ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top, behavior: 'smooth' });
        if (mobileNav) {
          mobileNav.classList.remove('open');
          document.body.style.overflow = '';
        }
      }
    });
  });

});
