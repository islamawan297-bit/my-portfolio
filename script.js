document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // Hide Loader
  const loader = document.getElementById('loader-wrapper');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
      }, 300); // Small delay for ultra smooth transition
    });
  }

  // Header Scroll Effect
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      
      // Update menu icon
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.setAttribute('data-lucide', 'x');
        } else {
          icon.setAttribute('data-lucide', 'menu');
        }
        lucide.createIcons();
      }
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }

  // Scroll Animations using Intersection Observer
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target); // Animate only once
      }
    });
  }, observerOptions);

  animateElements.forEach(el => observer.observe(el));

  // Page-by-page navigation router
  function showPage(targetId) {
    if (!targetId || targetId === '#') {
      targetId = 'home';
    } else {
      targetId = targetId.replace('#', '');
    }

    // Hide all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      section.classList.remove('active');
    });

    const activeSection = document.getElementById(targetId);
    if (activeSection) {
      activeSection.classList.add('active');
      
      // Also show social cards on projects page
      if (targetId === 'projects') {
        const socialCards = document.getElementById('social-cards');
        if (socialCards) {
          socialCards.classList.add('active');
        }
      }

      // Trigger entrance animations for active section elements
      const anims = activeSection.querySelectorAll('.animate-on-scroll');
      anims.forEach(el => el.classList.add('animated'));

      if (targetId === 'projects') {
        const socialAnims = document.querySelectorAll('#social-cards .animate-on-scroll');
        socialAnims.forEach(el => el.classList.add('animated'));
      }
    }

    // Update active nav link
    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${targetId}`) {
        item.classList.add('active');
      }
    });

    // Scroll back to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Handle routing via Hash
  window.addEventListener('hashchange', () => {
    showPage(window.location.hash);
  });

  // Initial load navigation
  showPage(window.location.hash);

  // Back to Top Button
  const backToTop = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Contact Form Validation & Submission
  const contactForm = document.getElementById('contact-form');
  const successOverlay = document.getElementById('success-overlay');
  const closeSuccessBtn = document.getElementById('close-success-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const fields = ['name', 'email', 'subject', 'message'];
      
      fields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        const error = document.getElementById(`${fieldId}-error`);
        
        if (!input || !error) return;

        // Reset error state
        error.style.display = 'none';
        input.style.borderColor = 'var(--border-color)';

        // Check empty
        if (!input.value.trim()) {
          error.textContent = 'This field is required.';
          error.style.display = 'block';
          input.style.borderColor = '#ef4444';
          isValid = false;
        } 
        // Validate email format
        else if (fieldId === 'email' && !validateEmail(input.value)) {
          error.textContent = 'Please enter a valid email address.';
          error.style.display = 'block';
          input.style.borderColor = '#ef4444';
          isValid = false;
        }
      });

      if (isValid) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i data-lucide="loader" class="animate-spin"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();

        // Submit form using fetch to Formspree
        const formData = new FormData(contactForm);

        fetch("https://formspree.io/f/YOUR_FORMSPREE_ID", {
          method: "POST",
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        })
        .then(response => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          if (typeof lucide !== 'undefined') lucide.createIcons();

          if (response.ok) {
            if (successOverlay) {
              successOverlay.classList.add('active');
              contactForm.reset();
            }
          } else {
            alert("Oops! There was a problem submitting your form. Make sure you set your correct Formspree ID.");
          }
        })
        .catch(error => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
          if (typeof lucide !== 'undefined') lucide.createIcons();
          alert("Oops! There was a problem submitting your form.");
        });
      }
    });
  }

  if (closeSuccessBtn && successOverlay) {
    closeSuccessBtn.addEventListener('click', () => {
      successOverlay.classList.remove('active');
    });
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }
});
