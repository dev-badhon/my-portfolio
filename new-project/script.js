document.addEventListener('DOMContentLoaded', () => {
  // 1. Update Footer Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Toast Helper
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.remove('opacity-0', 'translate-y-3');
    toast.classList.add('opacity-100', 'translate-y-0');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-3');
      toast.classList.remove('opacity-100', 'translate-y-0');
    }, 2600);
  }

  // 3. Subtle Cursor Radial Glow on Bento Cards (Desktop pointers)
  const cards = document.querySelectorAll('.bento-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 4. Scroll Reveal Animation
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -20px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // 5. Interactive Skill Category Filtering
  const filterButtons = document.querySelectorAll('.skill-filter-btn');
  const skillItems = document.querySelectorAll('.skill-item');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      skillItems.forEach((item) => {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || category === filter;
        item.classList.toggle('hidden', !shouldShow);
      });
    });
  });

  // 6. Copy to Clipboard for Phone & Email
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      const label = btn.getAttribute('data-label') || 'Value';
      if (!text) return;

      try {
        await navigator.clipboard.writeText(text);
        showToast(`${label} copied: ${text}`);
      } catch {
        // Fallback for restricted contexts
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`${label} copied: ${text}`);
      }
    });
  });

  // 7. Download CV (PDF) feedback
  const downloadCvBtn = document.getElementById('download-cv-btn');
  if (downloadCvBtn) {
    downloadCvBtn.addEventListener('click', () => {
      showToast('Downloading Badhon_Chandra_Sheel_CV.pdf...');
    });
  }

  // 8. Contact Modal Logic
  const contactModal = document.getElementById('contact-modal');
  const openModalBtns = [
    document.getElementById('open-contact-btn'),
    document.getElementById('open-contact-btn-bottom'),
  ].filter(Boolean);
  const closeModalBtn = document.getElementById('close-modal-btn');
  const contactForm = document.getElementById('contact-form');

  function openModal() {
    if (!contactModal) return;
    contactModal.classList.remove('hidden');
    contactModal.classList.add('flex');
    document.body.style.overflow = 'hidden';
    const firstInput = document.getElementById('sender-name');
    if (firstInput) firstInput.focus();
  }

  function closeModal() {
    if (!contactModal) return;
    contactModal.classList.add('hidden');
    contactModal.classList.remove('flex');
    document.body.style.overflow = '';
  }

  openModalBtns.forEach((btn) => btn.addEventListener('click', openModal));
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && contactModal && !contactModal.classList.contains('hidden')) {
      closeModal();
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('sender-name').value.trim();
      const email = document.getElementById('sender-email').value.trim();
      const message = document.getElementById('sender-message').value.trim();

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );

      window.location.href = `mailto:dev.badhonks@gmail.com?subject=${subject}&body=${body}`;
      showToast('Opening your email client...');
      contactForm.reset();
      closeModal();
    });
  }
});
