/* =========================================================
   Très Jolie Festas — script.js
   ========================================================= */

// Troque aqui o número do WhatsApp (formato: 55 + DDD + número, só dígitos)
const WHATSAPP_NUMBER = '5561992378041';
const WHATSAPP_MESSAGE = 'Olá! Vim pelo site da Très Jolie Festas e gostaria de mais informações sobre locação.';

document.addEventListener('DOMContentLoaded', () => {
  setupWhatsappLinks();
  setupHeaderScroll();
  setupMobileMenu();
  setupSmoothScrollAndActiveMenu();
  setupScrollAnimations();
  setupImagePlaceholders();
  setupGalleryLightbox();
  setupHeroCarousel();
  setupCart();
  setYear();
});

/* ---------- WhatsApp ---------- */
function setupWhatsappLinks() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  document.querySelectorAll('.js-whatsapp').forEach((link) => {
    link.setAttribute('href', url);
  });
}

/* ---------- Header com blur ao rolar ---------- */
function setupHeaderScroll() {
  const header = document.getElementById('header');
  if (!header) return;

  const toggle = () => {
    header.classList.toggle('scrolled', window.scrollY > 10);
  };
  toggle();
  window.addEventListener('scroll', toggle, { passive: true });
}

/* ---------- Menu mobile ---------- */
function setupMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');
  if (!hamburger || !menu || !overlay) return;

  const openMenu = () => {
    menu.classList.add('open');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Fechar menu');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    menu.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menu');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', () => {
    const isOpen = menu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ---------- Scroll suave + menu ativo ---------- */
function setupSmoothScrollAndActiveMenu() {
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('main section[id], .footer[id]');

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Animações de entrada (IntersectionObserver) ---------- */
function setupScrollAnimations() {
  const items = document.querySelectorAll('.fade-in-up');
  if (!items.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 0.08}s`;
    observer.observe(item);
  });
}

/* ---------- Placeholder elegante para imagens ausentes ---------- */
function setupImagePlaceholders() {
  const photos = document.querySelectorAll('.js-photo');

  photos.forEach((img) => {
    const src = img.dataset.src;
    img.src = src;

    img.addEventListener('error', () => {
      const placeholder = document.createElement('div');
      placeholder.className = 'img-placeholder';
      placeholder.innerHTML = `
        <span class="emoji" aria-hidden="true">🎈</span>
        <span class="label">${img.alt || 'Foto em breve'}</span>
      `;
      img.replaceWith(placeholder);
    }, { once: true });
  });

  // Logos (não usam .js-photo, tratamos separadamente)
  document.querySelectorAll('img[src*="logo-tresjolie"]').forEach((logo) => {
    logo.addEventListener('error', () => {
      logo.style.display = 'none';
      const fallback = document.createElement('span');
      fallback.textContent = 'Très Jolie Festas';
      fallback.style.fontFamily = "'Playfair Display', serif";
      fallback.style.color = 'inherit';
      fallback.style.fontWeight = '600';
      fallback.style.fontSize = '1.1rem';
      logo.after(fallback);
    }, { once: true });
  });
}

/* ---------- Lightbox da galeria ---------- */
function setupGalleryLightbox() {
  const galleryItems = Array.from(document.querySelectorAll('.js-gallery-item'));
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const btnClose = document.getElementById('lightbox-close');
  const btnPrev = document.getElementById('lightbox-prev');
  const btnNext = document.getElementById('lightbox-next');

  if (!galleryItems.length || !lightbox || !lightboxImg) return;

  let currentIndex = 0;
  let lastFocusedElement = null;

  function getImageSrc(item) {
    const img = item.querySelector('img');
    const placeholder = item.querySelector('.img-placeholder');
    if (img) return { src: img.src, alt: img.alt };
    if (placeholder) return { src: null, alt: placeholder.querySelector('.label')?.textContent || '' };
    return { src: null, alt: '' };
  }

  function openLightbox(index) {
    currentIndex = index;
    lastFocusedElement = document.activeElement;
    updateLightboxImage();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  function updateLightboxImage() {
    const { src, alt } = getImageSrc(galleryItems[currentIndex]);
    if (src) {
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightboxImg.style.display = '';
    } else {
      lightboxImg.style.display = 'none';
    }
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    updateLightboxImage();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    updateLightboxImage();
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  btnClose.addEventListener('click', closeLightbox);
  btnNext.addEventListener('click', showNext);
  btnPrev.addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Swipe (mobile)
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? showPrev() : showNext();
    }
  }, { passive: true });
}

/* ---------- Carrossel de fundo do Hero ---------- */
function setupHeroCarousel() {
  const carousel = document.getElementById('hero-carousel');
  const track = document.getElementById('hero-carousel-track');
  const dotsWrap = document.getElementById('hero-carousel-dots');
  const scrollBtn = document.getElementById('hero-scroll');

  if (!carousel || !track || !dotsWrap) return;

  const slides = Array.from(track.children);
  if (!slides.length) return;

  let currentIndex = 0;
  let autoplayTimer = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const dots = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'hero__carousel-dot';
    dot.setAttribute('aria-label', `Ir para foto ${index + 1}`);
    dot.addEventListener('click', () => { goTo(index); startAutoplay(); });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function update() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, index) => dot.classList.toggle('is-active', index === currentIndex));
  }

  function goTo(index) {
    currentIndex = (index + slides.length) % slides.length;
    update();
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  function startAutoplay() {
    if (prefersReducedMotion) return;
    stopAutoplay();
    autoplayTimer = setInterval(next, 4500);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);

  // Swipe (mobile)
  let touchStartX = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  carousel.addEventListener('touchend', (e) => {
    const diff = e.changedTouches[0].screenX - touchStartX;
    if (Math.abs(diff) > 40) {
      diff > 0 ? prev() : next();
    }
    startAutoplay();
  }, { passive: true });

  if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
      const nextSection = document.getElementById('como-funciona');
      if (nextSection) nextSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  update();
  startAutoplay();
}

/* ---------- Carrinho de locação ---------- */
function setupCart() {
  const cartFloat = document.getElementById('cart-float');
  const cartBadge = document.getElementById('cart-badge');
  const cartDrawer = document.getElementById('cart-drawer');
  const cartOverlay = document.getElementById('cart-drawer-overlay');
  const cartClose = document.getElementById('cart-drawer-close');
  const cartItemsWrap = document.getElementById('cart-items');
  const checkoutBtn = document.getElementById('cart-checkout-btn');
  const addButtons = document.querySelectorAll('.js-add-to-cart');

  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutOverlay = document.getElementById('checkout-overlay');
  const checkoutCloseBtn = document.getElementById('checkout-close');
  const checkoutForm = document.getElementById('checkout-form');
  const nameInput = document.getElementById('checkout-name');
  const localInput = document.getElementById('checkout-local');
  const horarioInput = document.getElementById('checkout-horario');

  if (!cartFloat || !cartDrawer || !cartItemsWrap || !checkoutModal || !checkoutForm) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cart = [];

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function addToCart(name, image) {
    const existing = cart.find((item) => item.name === name);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name, image, qty: 1 });
    }
    renderCart();
  }

  function removeFromCart(name) {
    cart = cart.filter((item) => item.name !== name);
    renderCart();
  }

  function renderCart() {
    if (!cart.length) {
      cartItemsWrap.innerHTML = '<p class="cart-drawer__empty" id="cart-empty">Seu carrinho está vazio. Clique em "Alugar" nos cenários para adicionar aqui.</p>';
    } else {
      cartItemsWrap.innerHTML = cart.map((item) => `
        <div class="cart-item">
          <img class="cart-item__thumb" src="${item.image}" alt="${escapeHtml(item.name)}">
          <div class="cart-item__info">
            <p class="cart-item__name">${escapeHtml(item.name)}</p>
            <p class="cart-item__qty">Quantidade: ${item.qty}</p>
          </div>
          <button type="button" class="cart-item__remove js-cart-remove" data-name="${escapeHtml(item.name)}" aria-label="Remover ${escapeHtml(item.name)} do carrinho">&times;</button>
        </div>
      `).join('');

      cartItemsWrap.querySelectorAll('.js-cart-remove').forEach((btn) => {
        btn.addEventListener('click', () => removeFromCart(btn.dataset.name));
      });
    }

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    if (totalQty > 0) {
      cartBadge.hidden = false;
      cartBadge.textContent = totalQty;
    } else {
      cartBadge.hidden = true;
    }
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
  }

  function bumpCart() {
    cartFloat.classList.add('is-bumping');
    setTimeout(() => cartFloat.classList.remove('is-bumping'), 400);
  }

  function flyToCart(imgEl) {
    if (prefersReducedMotion || !imgEl) {
      bumpCart();
      return;
    }

    const startRect = imgEl.getBoundingClientRect();
    const endRect = cartFloat.getBoundingClientRect();

    const clone = document.createElement('img');
    clone.src = imgEl.src;
    clone.className = 'cart-fly-item';
    clone.style.left = `${startRect.left}px`;
    clone.style.top = `${startRect.top}px`;
    clone.style.width = `${startRect.width}px`;
    clone.style.height = `${startRect.height}px`;
    clone.style.opacity = '1';
    document.body.appendChild(clone);

    // Força o navegador a registrar o estado inicial antes de animar
    // eslint-disable-next-line no-unused-expressions
    clone.getBoundingClientRect();

    requestAnimationFrame(() => {
      clone.style.left = `${endRect.left + endRect.width / 2 - 14}px`;
      clone.style.top = `${endRect.top + endRect.height / 2 - 14}px`;
      clone.style.width = '28px';
      clone.style.height = '28px';
      clone.style.opacity = '0.2';
    });

    clone.addEventListener('transitionend', () => {
      clone.remove();
      bumpCart();
    }, { once: true });
  }

  function openDrawer() {
    cartDrawer.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    cartDrawer.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function openCheckout() {
    if (!cart.length) return;
    closeDrawer();
    checkoutModal.classList.add('open');
    checkoutOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    nameInput.focus();
  }

  function closeCheckout() {
    checkoutModal.classList.remove('open');
    checkoutOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  addButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const { name, image } = btn.dataset;
      addToCart(name, image);

      const card = btn.closest('.gallery-card');
      const img = card ? card.querySelector('img') : null;
      flyToCart(img);

      btn.classList.add('is-added');
      setTimeout(() => btn.classList.remove('is-added'), 900);
    });
  });

  cartFloat.addEventListener('click', openDrawer);
  if (cartClose) cartClose.addEventListener('click', closeDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeDrawer);
  if (checkoutBtn) checkoutBtn.addEventListener('click', openCheckout);
  if (checkoutCloseBtn) checkoutCloseBtn.addEventListener('click', closeCheckout);
  if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeCheckout);

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeCheckout();
    closeDrawer();
  });

  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;
    [nameInput, horarioInput].forEach((input) => {
      if (!input.value.trim()) {
        input.classList.add('is-invalid');
        valid = false;
      } else {
        input.classList.remove('is-invalid');
      }
    });
    if (!valid) return;

    const lines = [
      'Olá! Gostaria de fazer um pedido de locação pela Très Jolie Festas:',
      '',
      ...cart.map((item) => `• ${item.name}${item.qty > 1 ? ` (x${item.qty})` : ''}`),
      '',
      `Nome: ${nameInput.value.trim()}`,
    ];
    if (localInput.value.trim()) lines.push(`Local da festa: ${localInput.value.trim()}`);
    lines.push(`Data/horário do evento: ${horarioInput.value.trim()}`);

    const message = lines.join('\n');
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');

    closeCheckout();
    checkoutForm.reset();
    cart = [];
    renderCart();
  });

  renderCart();
}

/* ---------- Ano do rodapé ---------- */
function setYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
