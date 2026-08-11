if (!customElements.get('product-modal')) {
  customElements.define(
    'product-modal',
    class ProductModal extends ModalDialog {
      constructor() {
        super();
      }

      hide() {
        super.hide();
      }

      show(opener) {
        super.show(opener);
        this.showActiveMedia();
      }

      showActiveMedia() {
        const mediaId =
          this.openedBy?.getAttribute('data-media-id') ||
          this.openedBy?.querySelector('[data-media-id]')?.getAttribute('data-media-id') ||
          this.querySelector('[data-media-id]')?.getAttribute('data-media-id');

        if (!mediaId) return;

        this.querySelectorAll(
          `[data-media-id]:not([data-media-id="${mediaId}"])`
        ).forEach((element) => {
          element.classList.remove('active');
        });

        const activeMedia = this.querySelector(`[data-media-id="${mediaId}"]`);
        if (!activeMedia) return;

        const activeMediaTemplate = activeMedia.querySelector('template');
        const activeMediaContent = activeMediaTemplate ? activeMediaTemplate.content : null;
        activeMedia.classList.add('active');
        if (typeof activeMedia.scrollIntoView === 'function') {
          activeMedia.scrollIntoView();
        }

        const container = this.querySelector('[role="document"]');
        if (container && activeMedia.width) {
          container.scrollLeft = (activeMedia.width - container.clientWidth) / 2;
        }

        if (
          activeMedia.nodeName == 'DEFERRED-MEDIA' &&
          activeMediaContent &&
          activeMediaContent.querySelector('.js-youtube')
        )
          activeMedia.loadContent();
      }
    }
  );
}
