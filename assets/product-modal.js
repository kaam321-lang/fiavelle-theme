function registerProductModal() {
  const BaseModalClass = typeof ModalDialog !== 'undefined' ? ModalDialog : (customElements.get('modal-dialog') || HTMLElement);

  if (!customElements.get('product-modal')) {
    customElements.define(
      'product-modal',
      class ProductModal extends BaseModalClass {
        constructor() {
          super();
        }

        hide() {
          if (typeof super.hide === 'function') super.hide();
          else {
            document.body.classList.remove('overflow-hidden');
            this.removeAttribute('open');
            this.classList.remove('open');
          }
        }

        show(opener) {
          if (typeof super.show === 'function') super.show(opener);
          else {
            this.openedBy = opener;
            document.body.classList.add('overflow-hidden');
            this.setAttribute('open', '');
            this.classList.add('open');
          }
          this.showActiveMedia();
        }

        showActiveMedia() {
          let rawId =
            this.openedBy?.getAttribute('data-media-id') ||
            this.openedBy?.querySelector('[data-media-id]')?.getAttribute('data-media-id') ||
            '';

          let mediaId = rawId;
          if (rawId && rawId.includes('-')) {
            const parts = rawId.split('-');
            mediaId = parts[parts.length - 1];
          }

          let activeMedia = null;
          if (mediaId) {
            activeMedia =
              this.querySelector(`[data-media-id="${mediaId}"]`) ||
              this.querySelector(`[data-media-id="${rawId}"]`) ||
              this.querySelector(`[data-media-id*="${mediaId}"]`);
          }

          if (!activeMedia) {
            activeMedia = this.querySelector('.product-media-modal__content > *');
          }

          this.querySelectorAll('.product-media-modal__content > *').forEach((element) => {
            element.classList.remove('active');
          });

          if (activeMedia) {
            const activeMediaTemplate = activeMedia.querySelector('template');
            if (activeMediaTemplate && activeMediaTemplate.content) {
              activeMedia.appendChild(activeMediaTemplate.content.cloneNode(true));
            }
            activeMedia.classList.add('active');
            if (typeof activeMedia.scrollIntoView === 'function') {
              activeMedia.scrollIntoView();
            }

            const container = this.querySelector('[role="document"]');
            if (container && activeMedia.width) {
              container.scrollLeft = (activeMedia.width - container.clientWidth) / 2;
            }
          }

          if (
            activeMedia &&
            activeMedia.nodeName == 'DEFERRED-MEDIA' &&
            activeMedia.querySelector('template') &&
            activeMedia.querySelector('iframe') === null
          ) {
            if (typeof activeMedia.loadContent === 'function') activeMedia.loadContent();
          }
        }
      }
    );
  }
}

if (typeof ModalDialog !== 'undefined') {
  registerProductModal();
} else {
  customElements.whenDefined('modal-dialog').then(registerProductModal).catch(() => registerProductModal());
  document.addEventListener('DOMContentLoaded', registerProductModal);
}

document.addEventListener('click', (event) => {
  const trigger = event.target.closest(
    '.product__modal-opener, .product__media-toggle, .product__media, .product__media-icon, .product__media-item img'
  );
  if (!trigger) return;

  // Ignore if clicking close button inside modal or inside modal content
  if (event.target.closest('.product-media-modal')) return;

  const modal =
    document.querySelector('product-modal') ||
    document.querySelector('.product-media-modal');
  if (modal && typeof modal.show === 'function' && !modal.hasAttribute('open')) {
    const button = trigger.closest('modal-opener')?.querySelector('button') || trigger;
    modal.show(button);
  }
});
