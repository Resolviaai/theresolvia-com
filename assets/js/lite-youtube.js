/**
 * Resolvia Studio - Lite YouTube Embed Component (<lite-youtube>)
 * ===============================================================
 * Ultra-fast, zero-overhead YouTube player facade.
 * - Initial load: ~20KB (only thumbnail + SVG play button) vs ~1.2MB standard iframe
 * - Loads actual YouTube iframe only on user click/interaction
 * - Uses privacy-enhanced www.youtube-nocookie.com
 * - Auto-resolves high-res WebP thumbnails
 * 
 * Usage in HTML/Markdown:
 * <lite-youtube videoid="dQw4w9WgXcQ" playlabel="Watch Retention Breakdown"></lite-youtube>
 */

class LiteYouTube extends HTMLElement {
  connectedCallback() {
    this.videoId = this.getAttribute('videoid');
    if (!this.videoId) return;

    this.playLabel = this.getAttribute('playlabel') || 'Play Video';
    this.posterUrl = this.getAttribute('poster') || `https://i.ytimg.com/vi_webp/${this.videoId}/maxresdefault.webp`;

    this.render();
    this.addEventListener('click', () => this.activate(), { once: true });
    this.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.activate();
      }
    }, { once: true });
  }

  render() {
    this.tabIndex = 0;
    this.setAttribute('role', 'button');
    this.setAttribute('aria-label', this.playLabel);
    this.classList.add('lite-yt-facade');

    this.innerHTML = `
      <div class="lite-yt-backdrop" style="background-image: url('${this.posterUrl}');">
        <picture>
          <source srcset="https://i.ytimg.com/vi_webp/${this.videoId}/maxresdefault.webp" type="image/webp">
          <source srcset="https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg" type="image/jpeg">
          <img src="https://i.ytimg.com/vi/${this.videoId}/hqdefault.jpg" alt="${this.playLabel}" loading="lazy" decoding="async">
        </picture>
      </div>
      <button class="lite-yt-btn" type="button" aria-label="${this.playLabel}">
        <svg class="lite-yt-icon" viewBox="0 0 68 48" width="68" height="48">
          <path class="lite-yt-btn-bg" d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#212121" fill-opacity="0.8"></path>
          <path d="M 45,24 27,14 27,34" fill="#ffffff"></path>
        </svg>
      </button>
    `;
  }

  activate() {
    const iframe = document.createElement('iframe');
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.title = this.playLabel;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(this.videoId)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    
    this.innerHTML = '';
    this.appendChild(iframe);
    this.classList.add('lite-yt-activated');
  }
}

if ('customElements' in window && !customElements.get('lite-youtube')) {
  customElements.define('lite-youtube', LiteYouTube);
}
