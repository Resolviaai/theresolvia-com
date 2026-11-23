/**
 * Resolvia consultation popup — self-injecting, dependency-free.
 *
 * Injects a small opt-in trigger and, on click, an accessible consultation
 * dialog for the site's existing 30-minute retention audit. The only action
 * is a normal link to the existing Calendly booking page; this asset collects
 * no data, sets no marketing cookies, and edits no HTML or existing CSS.
 *
 * Load with: <script defer src="/assets/resolvia-popup.js"></script>
 */
(function () {
  'use strict';

  // Double-inclusion guard. Expose nothing else globally.
  if (window.__rsvpInitialized) return;
  window.__rsvpInitialized = true;

  var CALENDLY_URL = 'https://calendly.com/resolviaai/meet';
  var PRIVACY_URL = 'https://theresolvia.com/privacy.html'; // canonical, never localhost
  var CSS_URL = '/assets/resolvia-popup.css';
  var COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000; // 14-day dismissal cooldown (spec Popup B)
  var SESSION_DISMISS_LIMIT = 3;

  // Storage keys are unique; never reuse the demo app's resolvia-studio-* keys.
  var KEYS = {
    dismissals: 'rsvp_session_dismissals',
    cooldown: 'rsvp_cooldown_until',
    converted: 'rsvp_converted'
  };

  var sessionStore = null;
  var localStore = null;
  var deviceClass = 'desktop';
  var trigger = null;
  var overlay = null;
  var dialog = null;
  var closeBtn = null;
  var isOpen = false;
  var openedAt = 0;
  var lastFocused = null;
  var savedOverflow = '';
  var savedPaddingRight = '';

  function dialogIsOpen() {
    return document.documentElement.classList.contains('rsvp-open');
  }

  /* ---------- Safe helpers: private mode / blocked storage never throw ---------- */

  function getStore(which) {
    try {
      return which === 'local' ? window.localStorage : window.sessionStorage;
    } catch (e) {
      return null;
    }
  }
  function read(store, key) {
    try {
      return store ? store.getItem(key) : null;
    } catch (e) {
      return null;
    }
  }
  function write(store, key, value) {
    try {
      if (store) store.setItem(key, value);
    } catch (e) { /* storage disabled: fail silently */ }
  }
  function toInt(value) {
    var n = parseInt(value, 10);
    return isNaN(n) ? 0 : n;
  }

  /** Route through the site's analytics bridge; fall back to dataLayer; never throw. */
  function track(name, params) {
    try {
      var data = { popup_variant: 'audit_click', page_path: window.location.pathname, device_class: deviceClass };
      var key;
      for (key in (params || {})) {
        if (Object.prototype.hasOwnProperty.call(params, key)) data[key] = params[key];
      }
      data.popup_variant = 'audit_click';
      if (window.ResolviaAnalytics && typeof window.ResolviaAnalytics.track === 'function') {
        window.ResolviaAnalytics.track(name, data);
      } else if (window.dataLayer && typeof window.dataLayer.push === 'function') {
        var event = { event: name };
        for (key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) event[key] = data[key];
        }
        window.dataLayer.push(event);
      }
      // Note: begin_checkout / schedule_consultation_intent are already emitted
      // by assets/analytics.js on any Calendly link click. Do not duplicate them.
    } catch (e) { /* analytics is optional */ }
  }

  /* ---------- Page + frequency rules ---------- */

  var APP_PAGE = /^\/(super-search|mcp|copilot|script-studio|auto-editing)(\/|\.html|$)/i;
  var LEGAL_PAGE = /^\/(privacy|terms|security|careers)\.html$/i;

  /** Return a suppression reason, or null when the popup may mount. */
  function suppressionReason() {
    if (dialogIsOpen()) return 'dialog_open';

    var path = window.location.pathname || '/';
    if (APP_PAGE.test(path) || LEGAL_PAGE.test(path)) return 'page_rule';

    // Functional demo UI and app chrome: stay strictly out of the way.
    if (document.querySelector('[data-resolvia-studio-frame], .pmodal, .st-toast')) return 'page_rule';

    // An inline banner already makes the identical booking ask: do not duplicate it.
    if (document.querySelector('.conversion-banner, [data-home-section="crewBanner"]')) return 'existing_banner';

    if (read(localStore, KEYS.converted) === '1') return 'converted';
    if (toInt(read(localStore, KEYS.cooldown)) > Date.now()) return 'frequency_cap';
    if (toInt(read(sessionStore, KEYS.dismissals)) >= SESSION_DISMISS_LIMIT) return 'frequency_cap';

    return null;
  }

  /* ---------- DOM construction ---------- */

  function el(tag, attrs, html) {
    var node = document.createElement(tag);
    var key;
    for (key in (attrs || {})) {
      if (Object.prototype.hasOwnProperty.call(attrs, key)) node.setAttribute(key, attrs[key]);
    }
    if (html != null) node.innerHTML = html;
    node.setAttribute('data-rsvp', '1'); // stable, single addition for body MutationObservers
    return node;
  }

  function loadStylesheet() {
    try {
      var link = el('link', { rel: 'stylesheet', href: CSS_URL });
      // Reveal the trigger once styles are applied; fall back if onload is missed.
      var revealed = false;
      function reveal() {
        if (revealed || !trigger) return;
        revealed = true;
        trigger.style.opacity = '';
      }
      link.onload = reveal;
      link.onerror = reveal;
      document.head.appendChild(link);
      window.setTimeout(reveal, 500);
    } catch (e) {
      if (trigger) trigger.style.opacity = '';
    }
  }

  function build() {
    var iconArrow = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false">' +
      '<path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var iconClose = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">' +
      '<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

    // Trigger starts hidden inline to avoid a flash before the stylesheet loads.
    trigger = el('button', {
      type: 'button',
      'class': 'rsvp-trigger',
      style: 'opacity:0',
      'aria-label': 'Open 30-minute retention audit details',
      'aria-haspopup': 'dialog',
      'aria-expanded': 'false',
      'aria-controls': 'rsvp-dialog'
    }, '<span class="rsvp-trigger-long">30-minute retention audit</span>' +
       '<span class="rsvp-trigger-short">30-min audit</span>' + iconArrow);
    trigger.style.opacity = '0';

    overlay = el('div', { 'class': 'rsvp-overlay', hidden: '' });
    dialog = el('div', {
      'class': 'rsvp-dialog',
      id: 'rsvp-dialog',
      role: 'dialog',
      'aria-modal': 'true',
      'aria-labelledby': 'rsvp-title',
      'aria-describedby': 'rsvp-desc',
      tabindex: '-1'
    });
    dialog.appendChild(el('div', { 'class': 'rsvp-handle' }));
    closeBtn = el('button', {
      type: 'button', 'class': 'rsvp-close', 'aria-label': 'Close dialog'
    }, iconClose);

    var title = el('h2', { id: 'rsvp-title', 'class': 'rsvp-title' }, 'Get a 30-minute retention audit');
    var desc = el('p', { id: 'rsvp-desc', 'class': 'rsvp-desc' },
      'A direct 30-minute creative strategy and retention audit with our lead post-production team. ' +
      'After booking, we review your current content, define your hook and editing style, and edit ' +
      'your first sample video within 48 hours.');
    var proof = el('p', { 'class': 'rsvp-proof' },
      '50M+ combined client views. 41+ featured case studies.');

    var cta = el('a', {
      'class': 'rsvp-cta',
      href: CALENDLY_URL,
      target: '_blank',
      rel: 'noopener noreferrer'
    }, 'Book the 30-minute audit');

    var footer = el('div', { 'class': 'rsvp-footer' });
    var decline = el('button', { type: 'button', 'class': 'rsvp-decline' }, 'No thanks');
    var privacy = el('a', {
      'class': 'rsvp-privacy',
      href: PRIVACY_URL,
      target: '_blank',
      rel: 'noopener noreferrer'
    }, 'How we handle your data');
    footer.appendChild(decline);
    footer.appendChild(privacy);

    dialog.appendChild(closeBtn);
    dialog.appendChild(title);
    dialog.appendChild(desc);
    dialog.appendChild(proof);
    dialog.appendChild(cta);
    dialog.appendChild(footer);
    overlay.appendChild(dialog);

    document.body.appendChild(trigger);
    document.body.appendChild(overlay);
    loadStylesheet();

    // --- events ---
    trigger.addEventListener('click', function () {
      track('popup_trigger_clicked', { popup_trigger: 'click', trigger_position: 'floating' });
      open('trigger');
    });
    closeBtn.addEventListener('click', function () { close('close_button'); });
    decline.addEventListener('click', function () { close('decline_link'); });
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close('outside_click');
    });
    cta.addEventListener('click', function () {
      // analytics.js already fires the Calendly checkout events on this link.
      track('popup_cta_clicked', { popup_trigger: 'click', cta_text: 'Book the 30-minute audit' });
      write(localStore, KEYS.converted, '1');
      close(null); // conversion, not a dismissal
      hideTrigger(); // permanently retire the trigger after booking
    });
  }

  /* ---------- Open / close, focus trap, scroll lock ---------- */

  var FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function focusableNodes() {
    var all = dialog.querySelectorAll(FOCUSABLE);
    var visible = [];
    for (var i = 0; i < all.length; i++) {
      if (all[i].offsetWidth > 0 || all[i].offsetHeight > 0 || all[i] === document.activeElement) {
        visible.push(all[i]);
      }
    }
    return visible;
  }

  function onKeydown(e) {
    var key = e.key || (e.keyCode === 27 ? 'Escape' : e.keyCode === 9 ? 'Tab' : '');
    if (key === 'Escape') {
      e.preventDefault();
      close('escape');
      return;
    }
    if (key !== 'Tab') return;

    var nodes = focusableNodes();
    if (!nodes.length) {
      e.preventDefault();
      dialog.focus();
      return;
    }
    var first = nodes[0];
    var last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (dialog === document.activeElement) {
      e.preventDefault();
      (e.shiftKey ? last : first).focus();
    }
  }

  function lockScroll() {
    try {
      var gap = window.innerWidth - document.documentElement.clientWidth;
      savedOverflow = document.body.style.overflow || '';
      savedPaddingRight = document.body.style.paddingRight || '';
      document.body.style.overflow = 'hidden';
      if (gap > 0) document.body.style.paddingRight = gap + 'px';
    } catch (e) { /* layout adjustments are best-effort */ }
  }
  function unlockScroll() {
    try {
      document.body.style.overflow = savedOverflow;
      document.body.style.paddingRight = savedPaddingRight;
    } catch (e) { /* no-op */ }
  }

  function open(source) {
    if (isOpen || dialogIsOpen()) return;
    isOpen = true;
    openedAt = Date.now();
    lastFocused = document.activeElement;

    overlay.hidden = false;
    // Force a reflow so the entry transition runs when unhiding.
    void overlay.offsetWidth;
    overlay.classList.add('rsvp-open');
    document.documentElement.classList.add('rsvp-open');
    trigger.setAttribute('aria-expanded', 'true');
    lockScroll();
    document.addEventListener('keydown', onKeydown, true);

    track('popup_impression', { popup_trigger: 'click', open_source: source });
    track('popup_opened', { popup_trigger: 'click', open_source: source });

    if (closeBtn) closeBtn.focus();
    else dialog.focus();
  }

  function hideTrigger() {
    if (trigger && trigger.parentNode) trigger.parentNode.removeChild(trigger);
  }

  function recordDismissal() {
    var count = toInt(read(sessionStore, KEYS.dismissals)) + 1;
    write(sessionStore, KEYS.dismissals, String(count));
    // Cooldown caps new page loads for 14 days; the trigger stays available in
    // this session until the cap, so focus can always return to it on close.
    write(localStore, KEYS.cooldown, String(Date.now() + COOLDOWN_MS));
    if (count >= SESSION_DISMISS_LIMIT) hideTrigger();
  }

  function close(method) {
    if (!isOpen) return;
    isOpen = false;
    document.removeEventListener('keydown', onKeydown, true);

    overlay.classList.remove('rsvp-open');
    document.documentElement.classList.remove('rsvp-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    unlockScroll();

    if (method) {
      track('popup_dismissed', {
        popup_trigger: 'click',
        method: method,
        time_to_close_ms: Date.now() - openedAt
      });
      recordDismissal();
    }

    window.setTimeout(function () {
      if (!isOpen) overlay.hidden = true;
    }, 220);

    // Return focus to the element that opened the dialog.
    var target = (lastFocused && document.contains(lastFocused) && typeof lastFocused.focus === 'function')
      ? lastFocused
      : trigger;
    if (target && typeof target.focus === 'function') target.focus();
  }

  /* ---------- Boot ---------- */

  function init() {
    try {
      sessionStore = getStore('session');
      localStore = getStore('local');
      try {
        deviceClass = window.matchMedia && window.matchMedia('(pointer: coarse)').matches ? 'touch' : 'desktop';
      } catch (e) {
        deviceClass = 'desktop';
      }

      var reason = suppressionReason();
      if (reason) {
        track('popup_suppressed', { reason: reason });
        return;
      }
      build();
    } catch (e) {
      // Never let a marketing overlay break the host page.
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
