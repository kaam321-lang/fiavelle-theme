/**
 * whatsapp.js
 * Floating WhatsApp button injected on all pages
 * Fiavelle Theme
 */

(function () {
  'use strict';

  // ============================================================
  // CONFIGURATION - Update these values in Shopify theme settings
  // ============================================================
  var WHATSAPP_NUMBER = '56941944494'; // Official WhatsApp Fiavelle: +56 9 4194 4494
  var WHATSAPP_MESSAGE = encodeURIComponent('¡Hola Fiavelle! Me gustaría obtener más información sobre sus productos y asesoría con mis tallas. 🌸');

  // ============================================================
  // CREATE BUTTON
  // ============================================================
  function createWhatsAppButton() {
    var href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + WHATSAPP_MESSAGE;

    var button = document.createElement('a');
    button.href = href;
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    button.className = 'whatsapp-float';
    button.setAttribute('aria-label', 'Contactar por WhatsApp');
    button.setAttribute('id', 'whatsapp-float-btn');

    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

    // Tooltip
    var tooltip = document.createElement('span');
    tooltip.className = 'whatsapp-tooltip';
    tooltip.textContent = '¿Necesitas ayuda?';
    tooltip.style.cssText = [
      'position: absolute',
      'right: 68px',
      'top: 50%',
      'transform: translateY(-50%)',
      'background: #ffffff',
      'color: #121212',
      'padding: 8px 14px',
      'border-radius: 4px',
      'font-family: "Archivo Narrow", sans-serif',
      'font-size: 13px',
      'font-weight: 500',
      'white-space: nowrap',
      'box-shadow: 0 2px 12px rgba(0,0,0,0.15)',
      'opacity: 0',
      'pointer-events: none',
      'transition: opacity 0.2s ease',
      'letter-spacing: 0.03em'
    ].join(';');

    button.appendChild(tooltip);

    // Show tooltip on hover
    button.addEventListener('mouseenter', function () {
      tooltip.style.opacity = '1';
    });
    button.addEventListener('mouseleave', function () {
      tooltip.style.opacity = '0';
    });

    // Pulse animation styles
    var style = document.createElement('style');
    style.textContent = [
      '.whatsapp-float {',
      '  animation: whatsapp-bounce 2.5s ease-in-out infinite;',
      '}',
      '@keyframes whatsapp-bounce {',
      '  0%, 100% { transform: scale(1); }',
      '  50% { transform: scale(1.05); }',
      '}',
      '.whatsapp-float:hover {',
      '  animation: none;',
      '  transform: scale(1.1) !important;',
      '}'
    ].join('\n');
    document.head.appendChild(style);

    return button;
  }

  // ============================================================
  // INJECT ON PAGE LOAD
  // ============================================================
  function init() {
    // Don't add if already exists
    if (document.getElementById('whatsapp-float-btn')) return;

    var button = createWhatsAppButton();
    document.body.appendChild(button);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
