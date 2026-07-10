/**
 * fiavelle.js
 * Main JavaScript for Fiavelle Shopify Theme
 * Handles: Cart Drawer, Mobile Menu, ESC key, scroll effects
 */

(function () {
  'use strict';

  /* ============================================================
     CART DRAWER
     ============================================================ */
  const CartDrawer = {
    drawer: null,
    overlay: null,
    closeBtn: null,
    cartIcon: null,

    init() {
      this.drawer = document.getElementById('CartDrawer');
      this.overlay = document.getElementById('CartDrawerOverlay');
      this.closeBtn = document.getElementById('CartDrawerClose');
      this.cartIcon = document.getElementById('cart-icon-bubble');

      if (!this.drawer) return;

      // Open on cart icon click
      if (this.cartIcon) {
        this.cartIcon.addEventListener('click', (e) => {
          e.preventDefault();
          this.open();
        });
      }

      // Close on close button
      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      // Close on overlay click
      if (this.overlay) {
        this.overlay.addEventListener('click', () => this.close());
      }

      // ESC to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.drawer.getAttribute('aria-hidden') === 'false') {
          this.close();
        }
      });
    },

    open() {
      if (!this.drawer) return;
      this.drawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      this.closeBtn && this.closeBtn.focus();

      // Show the overlay behind the drawer
      const globalOverlay = document.getElementById('CartOverlay');
      if (globalOverlay) globalOverlay.classList.add('is-active');
    },

    close() {
      if (!this.drawer) return;
      this.drawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      this.cartIcon && this.cartIcon.focus();

      const globalOverlay = document.getElementById('CartOverlay');
      if (globalOverlay) globalOverlay.classList.remove('is-active');
    }
  };

  /* ============================================================
     MOBILE MENU
     ============================================================ */
  const MobileMenu = {
    drawer: null,
    overlay: null,
    openBtn: null,
    closeBtn: null,

    init() {
      this.drawer = document.getElementById('MobileMenuDrawer');
      this.overlay = document.getElementById('MobileMenuOverlay');
      this.openBtn = document.querySelector('.btn-hamburger');
      this.closeBtn = document.querySelector('.btn-close-mobile');

      if (!this.drawer) return;

      if (this.openBtn) {
        this.openBtn.addEventListener('click', () => this.open());
      }

      if (this.closeBtn) {
        this.closeBtn.addEventListener('click', () => this.close());
      }

      if (this.overlay) {
        this.overlay.addEventListener('click', () => this.close());
      }

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.drawer.getAttribute('aria-hidden') === 'false') {
          this.close();
        }
      });
    },

    open() {
      if (!this.drawer) return;
      this.drawer.setAttribute('aria-hidden', 'false');
      this.openBtn && this.openBtn.setAttribute('aria-expanded', 'true');
      this.overlay && this.overlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    },

    close() {
      if (!this.drawer) return;
      this.drawer.setAttribute('aria-hidden', 'true');
      this.openBtn && this.openBtn.setAttribute('aria-expanded', 'false');
      this.overlay && this.overlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  };

  /* ============================================================
     STICKY HEADER SCROLL EFFECT
     ============================================================ */
  const StickyHeader = {
    header: null,
    lastScrollY: 0,

    init() {
      this.header = document.getElementById('SiteHeader');
      if (!this.header) return;

      this.handleScroll = this.handleScroll.bind(this);
      window.addEventListener('scroll', this.handleScroll, { passive: true });
    },

    handleScroll() {
      const scrollY = window.scrollY;
      if (scrollY > 10) {
        this.header.classList.add('header--scrolled');
      } else {
        this.header.classList.remove('header--scrolled');
      }
      this.lastScrollY = scrollY;
    }
  };

  /* ============================================================
     CART QUANTITY CONTROLS (in drawer)
     ============================================================ */
  const CartQuantity = {
    init() {
      document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-btn-minus')) {
          const index = e.target.dataset.index;
          const input = document.getElementById(`Drawer-quantity-${index}`);
          if (input) {
            const newVal = Math.max(0, parseInt(input.value, 10) - 1);
            input.value = newVal;
            this.updateCart(index, newVal);
          }
        }

        if (e.target.classList.contains('quantity-btn-plus')) {
          const index = e.target.dataset.index;
          const input = document.getElementById(`Drawer-quantity-${index}`);
          if (input) {
            const newVal = parseInt(input.value, 10) + 1;
            input.value = newVal;
            this.updateCart(index, newVal);
          }
        }
      });
    },

    updateCart(index, quantity) {
      const updates = {};
      updates[index] = quantity;

      fetch(window.routes ? window.routes.cart_update_url : '/cart/update.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ updates })
      })
        .then((res) => res.json())
        .then((cart) => {
          this.updateCartCount(cart.item_count);
          if (quantity === 0) {
            const cartItem = document.getElementById(`CartItem-${index}`);
            if (cartItem) cartItem.remove();
          }
        })
        .catch((err) => console.error('Cart update error:', err));
    },

    updateCartCount(count) {
      const bubbles = document.querySelectorAll('.cart-count-bubble span[aria-hidden]');
      bubbles.forEach((bubble) => {
        bubble.textContent = count;
      });
    }
  };

  /* ============================================================
     ANNOUNCEMENT BAR - Sticky offset for header
     ============================================================ */
  const AnnouncementOffset = {
    init() {
      const bar = document.querySelector('.announcement-bar');
      const header = document.getElementById('SiteHeader');
      if (!bar || !header) return;

      const updateOffset = () => {
        const barHeight = bar.offsetHeight;
        header.style.top = `${barHeight}px`;
      };

      updateOffset();
      window.addEventListener('resize', updateOffset, { passive: true });
    }
  };

  /* ============================================================
     INIT ALL MODULES
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    CartDrawer.init();
    MobileMenu.init();
    StickyHeader.init();
    CartQuantity.init();
    AnnouncementOffset.init();
  });

})();
