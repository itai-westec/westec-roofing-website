// Navbar scroll effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// Scroll animation observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .portfolio-item, .tesla-feature, .area-tag, .blog-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'all 0.6s ease';
  observer.observe(el);
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenu = document.querySelector('.mobile-menu');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenu && navLinks) {
    mobileMenu.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
});

// Portfolio filter pills
document.addEventListener('DOMContentLoaded', () => {
  const filterPills = document.querySelectorAll('.filter-pill');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterPills.length > 0) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        const filter = pill.getAttribute('data-filter');

        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        portfolioItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
});

// Phone number auto-formatting (XXX) XXX-XXXX
document.addEventListener('DOMContentLoaded', () => {
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      const digits = e.target.value.replace(/\D/g, '').substring(0, 10);
      let formatted = '';
      if (digits.length > 0) formatted = '(' + digits.substring(0, 3);
      if (digits.length >= 3) formatted += ') ';
      if (digits.length > 3) formatted += digits.substring(3, 6);
      if (digits.length >= 6) formatted += '-' + digits.substring(6);
      e.target.value = formatted;
    });
  }
});

// Contact form AJAX submission with redirect
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(response => {
        if (response.ok) {
          window.location.href = 'thank-you.html';
        } else {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Submit Estimate Request';
          alert('Something went wrong. Please try again or call us at (323) 250-3883.');
        }
      }).catch(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Estimate Request';
        alert('Something went wrong. Please try again or call us at (323) 250-3883.');
      });
    });
  }
});

// FAQ accordion
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        item.classList.toggle('active');
      });
    }
  });
});
