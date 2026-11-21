/**
 * Resolvia High-Performance Analytics & Conversion Tracker
 * Automatically captures AI Search citations, Calendly booking clicks,
 * scroll depth milestones, and dispatches to Google Analytics 4 (GA4).
 */
(function() {
  'use strict';

  // Configurable Measurement ID (override via window.RESOLVIA_GA4_ID if set)
  var GA4_ID = window.RESOLVIA_GA4_ID || 'G-RESOLVIA_PENDING';

  // 1. Detect AI Search Engine Grounding / Referrals
  var referrer = document.referrer.toLowerCase();
  var aiSource = null;
  if (referrer.indexOf('chatgpt.com') !== -1 || window.location.search.indexOf('utm_source=chatgpt') !== -1) {
    aiSource = 'ChatGPT';
  } else if (referrer.indexOf('perplexity.ai') !== -1 || window.location.search.indexOf('utm_source=perplexity') !== -1) {
    aiSource = 'Perplexity';
  } else if (referrer.indexOf('claude.ai') !== -1) {
    aiSource = 'Claude';
  } else if (referrer.indexOf('copilot.microsoft.com') !== -1 || referrer.indexOf('bing.com') !== -1) {
    aiSource = 'Bing_Copilot';
  } else if (referrer.indexOf('gemini.google.com') !== -1) {
    aiSource = 'Google_Gemini';
  }

  // 2. Safe Event Dispatcher
  function trackEvent(eventName, params) {
    params = params || {};
    params.page_location = window.location.href;
    params.page_title = document.title;

    if (window.gtag) {
      window.gtag('event', eventName, params);
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: eventName }, params));
    }

    if (window.console && console.debug) {
      console.debug('[Resolvia Analytics]', eventName, params);
    }
  }

  // Record AI Referral Event if detected
  if (aiSource) {
    trackEvent('ai_search_grounding_referral', {
      ai_engine: aiSource,
      landing_page: window.location.pathname
    });
  }

  // 3. Track Calendly Conversion Clicks
  document.addEventListener('click', function(e) {
    var target = e.target.closest('a');
    if (!target) return;

    var href = target.getAttribute('href') || '';
    if (href.indexOf('calendly.com') !== -1) {
      trackEvent('begin_checkout', {
        cta_text: target.innerText.trim(),
        destination: href,
        funnel_step: 'click_calendly_button'
      });
      trackEvent('schedule_consultation_intent', {
        cta_text: target.innerText.trim(),
        page_path: window.location.pathname
      });
    }
  }, true);

  // 4. Track Scroll Depth Milestones (25%, 50%, 75%, 90%)
  var milestones = { 25: false, 50: false, 75: false, 90: false };
  function checkScrollDepth() {
    var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    var currentPercent = Math.round((window.scrollY / scrollHeight) * 100);

    [25, 50, 75, 90].forEach(function(m) {
      if (currentPercent >= m && !milestones[m]) {
        milestones[m] = true;
        trackEvent('scroll_depth', {
          percent_scrolled: m,
          page_path: window.location.pathname
        });
      }
    });
  }

  window.addEventListener('scroll', checkScrollDepth, { passive: true });

  // 5. GA4 Bootstrap if ID is configured
  if (GA4_ID && GA4_ID !== 'G-RESOLVIA_PENDING') {
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA4_ID, {
      send_page_view: true,
      cookie_flags: 'SameSite=None;Secure'
    });
  }

  window.ResolviaAnalytics = {
    track: trackEvent,
    setGA4: function(id) {
      window.RESOLVIA_GA4_ID = id;
    }
  };
})();
