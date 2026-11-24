"""
Resolvia Scalable Content Engine (SSG)
=====================================
Compiles Markdown content into SEO/AEO/GEO optimized HTML pages.
Auto-updates:
- /blog/<slug>/index.html
- /blog.html (Blog Hub cards & links)
- /sitemap.xml (Priority crawl registry)
- /indexnow.json (Bing, Copilot & Search engine instant indexing)
- /netlify.toml (Clean URL redirects)
- /llms.txt & /llms-full.txt (AI grounding documentation)
"""

import os
import re
import json
import yaml
import markdown
from datetime import datetime

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT_DIR = os.path.join(ROOT_DIR, 'content', 'blog')
BLOG_OUTPUT_DIR = os.path.join(ROOT_DIR, 'blog')

# Load base styles, navbar, and footer templates
with open(os.path.join(ROOT_DIR, 'careers.html'), 'r', encoding='utf-8') as f:
    careers_html = f.read()

cursor_block = '''<script>
  (function() {
    if (window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      function loadDesktopCursors() {
        window.removeEventListener('pointermove', loadDesktopCursors);
        window.removeEventListener('mousemove', loadDesktopCursors);
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/assets/cursor.css';
        document.head.appendChild(link);
      }
      window.addEventListener('pointermove', loadDesktopCursors, { once: true, passive: true });
      window.addEventListener('mousemove', loadDesktopCursors, { once: true, passive: true });
    }
  })();
</script>'''

footer_m = re.search(r'(<footer id="footer".*?</footer>)', careers_html, re.DOTALL)
footer_html = footer_m.group(0) if footer_m else ''

def get_navbar(active_tab='blog'):
    work_active = ' active' if active_tab == 'work' else ''
    services_active = ' active' if active_tab == 'services' else ''
    blog_active = ' active' if active_tab == 'blog' else ''

    return f'''  <!-- Floating Supaste Notch Navbar -->
  <header class="fixed top-0 inset-x-0 z-50 flex justify-center pointer-events-none transition-all duration-300 resolvia-nav-container">
    <nav class="resolvia-nav-bar pointer-events-auto relative flex items-center justify-between bg-white" aria-label="Main Navigation">
      <div class="resolvia-nav-ear-left" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="20" height="20" style="transform: scaleX(-1); transform-origin: center;">
          <path d="M 0 0 L 20 0 C 8.954 0 0 8.954 0 20 Z" fill="#ffffff"></path>
        </svg>
      </div>

      <a href="/" class="flex shrink-0 items-center gap-2" aria-label="Resolvia Home">
        <img src="/brand/resolvia_r_logo.png" alt="Resolvia" style="height: 26px; width: 26px; border-radius: 7px; object-fit: contain;">
        <span style="font-weight: 600; font-size: 15px; letter-spacing: -0.02em; color: #09090b;">Resolvia</span>
      </a>

      <div class="resolvia-nav-links">
        <a href="/work/" class="resolvia-nav-link{work_active}">Work</a>
        <a href="/services/youtube-video-editing/" class="resolvia-nav-link{services_active}">Services</a>
        <a href="/#workflow" class="resolvia-nav-link">Process</a>
        <a href="/blog.html" class="resolvia-nav-link{blog_active}">Blog</a>
        <a href="/#faq" class="resolvia-nav-link">FAQ</a>
      </div>

      <div class="flex items-center">
        <a href="https://calendly.com/resolviaai/meet" target="_blank" rel="noopener noreferrer" class="resolvia-nav-cta">
          <span>Book a Call</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
        </a>
      </div>

      <div class="resolvia-nav-ear-right" aria-hidden="true">
        <svg viewBox="0 0 20 20" width="20" height="20">
          <path d="M 0 0 L 20 0 C 8.954 0 0 8.954 0 20 Z" fill="#ffffff"></path>
        </svg>
      </div>
    </nav>
  </header>'''

def build_article_html(meta, body_html):
    title = meta.get('title', 'Resolvia Editorial')
    description = meta.get('description', '')
    slug = meta.get('slug', '')
    category = meta.get('category', 'Retention Science')
    badge = meta.get('badge', category)
    read_time = meta.get('readTime', '7 min read')
    author = meta.get('author', 'Resolvia Editorial Team')
    published = meta.get('datePublished', '2026-11-21T08:00:00+00:00')
    modified = meta.get('dateModified', published)
    aeo_answer = meta.get('aeoDirectAnswer', '')
    canonical_url = f"https://theresolvia.com/blog/{slug}/"

    cover_image = meta.get('coverImage', '')

    # Schema JSON-LD
    schema_dict = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Article",
                "@id": f"{canonical_url}#article",
                "headline": title,
                "description": description,
                "author": { "@type": "Organization", "name": author, "url": "https://theresolvia.com/" },
                "publisher": { "@type": "Organization", "name": "Resolvia", "url": "https://theresolvia.com/" },
                "datePublished": published,
                "dateModified": modified,
                "mainEntityOfPage": canonical_url
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://theresolvia.com/" },
                    { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://theresolvia.com/blog.html" },
                    { "@type": "ListItem", "position": 3, "name": title, "item": canonical_url }
                ]
            }
        ]
    }

    if cover_image:
        schema_dict["@graph"][0]["image"] = f"https://theresolvia.com{cover_image}"

    # Add FAQPage schema if FAQs exist
    faqs = meta.get('faqs', [])
    if faqs:
        faq_entity = {
            "@type": "FAQPage",
            "mainEntity": [
                {
                    "@type": "Question",
                    "name": item.get('q', ''),
                    "acceptedAnswer": { "@type": "Answer", "text": item.get('a', '') }
                }
                for item in faqs
            ]
        }
        schema_dict["@graph"].append(faq_entity)

    schema_json = json.dumps(schema_dict, indent=2)

    cover_image_html = ""
    if cover_image:
        cover_image_html = f'''
    <!-- Hero Cover Visual -->
    <div class="article-cover-container" style="margin: 28px 0 36px; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 12px 36px -12px rgba(0,0,0,0.6);">
      <img src="{cover_image}" alt="{title}" style="width: 100%; height: auto; display: block;" loading="eager" fetchpriority="high">
    </div>'''

    aeo_box_html = ""
    if aeo_answer:
        aeo_box_html = f'''
    <!-- Direct Answer AEO Box -->
    <section class="aeo-box" aria-label="Direct Answer Overview">
      <div class="aeo-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        <span>Direct Answer Overview</span>
      </div>
      <p class="aeo-text">{aeo_answer}</p>
    </section>'''

    faqs_html = ""
    if faqs:
        items_html = ""
        for f_item in faqs:
            items_html += f'''
      <div class="faq-item">
        <div class="faq-q">
          <span>{f_item.get('q')}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
        <div class="faq-a">{f_item.get('a')}</div>
      </div>'''
        faqs_html = f'''
    <!-- FAQs Section -->
    <section class="my-16">
      <h2 class="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
      {items_html}
    </section>'''

    return f'''<!DOCTYPE html>
<html lang="en">
<head>
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-6009719YB4"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());

  gtag('config', 'G-6009719YB4');
</script>

  <!-- Resolvia Official Identity & Favicons -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg"/>
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
  <link rel="shortcut icon" href="/favicon.ico"/>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
  <link rel="manifest" href="/site.webmanifest"/>
  <link rel="stylesheet" href="/assets/cursor.css"/>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <meta name="theme-color" content="#0B0F17"/>
  <title>{title} · Resolvia Studio</title>
  <meta name="description" content="{description}"/>
  <link rel="canonical" href="{canonical_url}"/>
  <meta property="og:title" content="{title}"/>
  <meta property="og:description" content="{description}"/>
  <meta property="og:url" content="{canonical_url}"/>
  <meta property="og:type" content="article"/>
  <meta property="og:site_name" content="Resolvia"/>
  <meta property="og:image" content="{f'https://theresolvia.com{cover_image}' if cover_image else 'https://theresolvia.com/brand/resolvia_r_logo.png'}"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="{title}"/>
  <meta name="twitter:description" content="{description}"/>
  <meta name="twitter:image" content="{f'https://theresolvia.com{cover_image}' if cover_image else 'https://theresolvia.com/brand/resolvia_r_logo.png'}"/>

  <link rel="stylesheet" href="/_next/static/chunks/1pmsn_rpclwta.css"/>
  <link rel="stylesheet" href="/_next/static/chunks/2rtpwwx2j42fi.css"/>

  {cursor_block}

  <style>
    :root {{
      --font-inter: 'Inter', -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
      --apple-spring: cubic-bezier(0.16, 1, 0.3, 1);
    }}
    html, body {{
      background-color: #0B0F17 !important;
      color: #eef1f8 !important;
      font-family: var(--font-inter) !important;
      -webkit-font-smoothing: antialiased !important;
      margin: 0;
      padding: 0;
    }}
    .resolvia-nav-container {{
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      z-index: 50 !important;
      display: flex !important;
      justify-content: center !important;
      pointer-events: none !important;
      padding: 0 16px !important;
    }}
    .resolvia-nav-links {{
      display: none !important;
      align-items: center !important;
      gap: 4px !important;
    }}
    @media (min-width: 768px) {{
      .resolvia-nav-links {{
        display: flex !important;
      }}
    }}
    .resolvia-nav-bar {{
      pointer-events: auto !important;
      position: relative !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 16px !important;
      background-color: #ffffff !important;
      border-bottom-left-radius: 18px !important;
      border-bottom-right-radius: 18px !important;
      padding: 6px 14px !important;
      min-height: 48px !important;
      height: 48px !important;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.35) !important;
      box-sizing: border-box !important;
    }}
    .resolvia-nav-ear-left, .resolvia-nav-ear-right {{
      position: absolute !important;
      top: 0 !important;
      width: 20px !important;
      height: 20px !important;
      pointer-events: none !important;
    }}
    .resolvia-nav-ear-left {{ left: -19.5px !important; }}
    .resolvia-nav-ear-right {{ right: -19.5px !important; }}
    .resolvia-nav-link {{
      font-size: 13.5px !important;
      font-weight: 500 !important;
      color: #4b5563 !important;
      text-decoration: none !important;
      padding: 6px 12px !important;
      border-radius: 8px !important;
      transition: color 0.15s, background-color 0.15s !important;
    }}
    .resolvia-nav-link:hover {{ color: #000000 !important; background-color: rgba(0,0,0,0.05) !important; }}
    .resolvia-nav-link.active {{
      color: #000000 !important;
      font-weight: 600 !important;
      background-color: rgba(0, 0, 0, 0.08) !important;
    }}
    .resolvia-nav-cta {{
      display: inline-flex !important;
      align-items: center !important;
      gap: 6px !important;
      border-radius: 10px !important;
      background-color: #09090b !important;
      color: #ffffff !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      padding: 6px 16px !important;
      min-height: 32px !important;
      text-decoration: none !important;
      box-shadow: 0 1px 3px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.22) !important;
      transition: transform 0.18s var(--apple-spring) !important;
    }}
    .resolvia-nav-cta:hover {{ transform: scale(1.02) !important; }}
    .resolvia-nav-cta:active {{ transform: scale(0.98) !important; }}

    .page-container {{
      max-width: 900px;
      margin: 0 auto;
      padding: 120px 24px 80px;
    }}
    .breadcrumb {{
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: rgba(238, 241, 248, 0.5);
      margin-bottom: 24px;
    }}
    .breadcrumb a {{
      color: rgba(238, 241, 248, 0.65);
      text-decoration: none;
      transition: color 0.15s;
    }}
    .breadcrumb a:hover {{ color: #2F86F7; }}
    .hero-badge {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(47, 134, 247, 0.10);
      border: 1px solid rgba(47, 134, 247, 0.25);
      color: #2F86F7;
      font-size: 13px;
      font-weight: 600;
      letter-spacing: 0.02em;
      margin-bottom: 20px;
    }}
    .hero-title {{
      font-size: clamp(30px, 4.5vw, 48px);
      font-weight: 700;
      line-height: 1.15;
      letter-spacing: -0.035em;
      color: #ffffff;
      margin: 0 0 16px;
    }}
    .article-meta {{
      font-size: 13.5px;
      color: rgba(238, 241, 248, 0.5);
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
    }}
    .aeo-box {{
      background: linear-gradient(135deg, rgba(47, 134, 247, 0.08) 0%, rgba(11, 15, 23, 0.95) 100%);
      border: 1px solid rgba(47, 134, 247, 0.35);
      border-radius: 16px;
      padding: 28px 32px;
      margin: 36px 0 44px;
    }}
    .aeo-label {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #2F86F7;
      margin-bottom: 12px;
    }}
    .aeo-text {{
      font-size: 18px;
      line-height: 1.6;
      color: #ffffff;
      font-weight: 500;
      margin: 0;
    }}
    .article-body {{
      color: rgba(238, 241, 248, 0.85);
      font-size: 16.5px;
      line-height: 1.75;
    }}
    .article-body h2 {{
      color: #ffffff;
      font-size: 26px;
      font-weight: 700;
      margin: 48px 0 16px;
      letter-spacing: -0.02em;
    }}
    .article-body h3 {{
      color: #ffffff;
      font-size: 20px;
      font-weight: 600;
      margin: 32px 0 12px;
    }}
    .article-body p {{
      margin: 0 0 20px;
    }}
    .article-body ul, .article-body ol {{
      margin: 0 0 24px;
      padding-left: 24px;
    }}
    .article-body li {{
      margin-bottom: 8px;
    }}
    .article-body strong {{
      color: #ffffff;
    }}
    .article-body a {{
      color: #2F86F7;
      text-decoration: underline;
    }}
    .article-body table {{
      width: 100%;
      border-collapse: collapse;
      margin: 28px 0;
      font-size: 14.5px;
    }}
    .article-body th {{
      border-bottom: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      text-align: left;
      padding: 10px 14px;
    }}
    .article-body td {{
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding: 12px 14px;
      color: rgba(238, 241, 248, 0.75);
    }}
    .article-body img {{
      width: 100%;
      height: auto;
      border-radius: 14px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      margin: 32px 0 16px;
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
      display: block;
    }}
    .article-body figure {{
      margin: 36px 0;
    }}
    .article-body figcaption {{
      font-size: 13px;
      color: rgba(238, 241, 248, 0.55);
      text-align: center;
      margin-top: 10px;
    }}
    .card-surface {{
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 28px;
      margin: 28px 0;
    }}
    .conversion-banner {{
      background: radial-gradient(ellipse 90% 80% at 50% -20%, rgba(47, 134, 247, 0.25), transparent 70%), rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(47, 134, 247, 0.3);
      border-radius: 24px;
      padding: 60px 32px;
      text-align: center;
      margin: 64px 0 32px;
    }}
    .cta-btn-primary {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 14px 28px;
      border-radius: 12px;
      background: #2F86F7;
      color: #ffffff;
      font-size: 15px;
      font-weight: 600;
      text-decoration: none;
      box-shadow: 0 4px 20px rgba(47, 134, 247, 0.35);
      transition: transform 0.18s var(--apple-spring);
    }}
    .cta-btn-primary:hover {{ transform: translateY(-2px); }}
    .faq-item {{
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 14px;
      margin-bottom: 14px;
      overflow: hidden;
    }}
    .faq-q {{
      padding: 18px 22px;
      font-size: 16.5px;
      font-weight: 600;
      color: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }}
    .faq-a {{
      padding: 0 22px 20px;
      font-size: 15px;
      line-height: 1.65;
      color: rgba(238, 241, 248, 0.72);
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      padding-top: 14px;
    }}
  </style>

  <script type="application/ld+json">
  {schema_json}
  </script>
</head>
<body>
  {get_navbar('blog')}

  <main class="page-container">
    <nav class="breadcrumb" aria-label="Breadcrumbs">
      <a href="/">Home</a>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
      <a href="/blog.html">Blog</a>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
      <span class="text-white">{title}</span>
    </nav>

    <div class="hero-badge">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
      <span>{badge}</span>
    </div>

    <h1 class="hero-title">{title}</h1>
    <div class="article-meta">
      <span>By {author}</span>
      <span>•</span>
      <span>{read_time}</span>
      <span>•</span>
      <span>Updated {published[:10]}</span>
    </div>

    {cover_image_html}

    {aeo_box_html}

    <article class="article-body">
      {body_html}
    </article>

    {faqs_html}

    <!-- Alternative Lead Capture Form -->
    <section class="card-surface my-16" style="border: 1px solid rgba(47, 134, 247, 0.25); background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(11,15,23,0.8) 100%);">
      <div class="max-w-xl mx-auto py-2">
        <h2 class="text-2xl font-bold text-white mb-2" style="margin-top:0;">Request a Production Retainer Quote</h2>
        <p class="text-sm text-slate-400 mb-6">Need expert post-production for your channel or company? Submit your channel details and our lead producer will reply within 4 hours.</p>

        <form name="creative-inquiry" method="POST" data-netlify="true" data-netlify-honeypot="bot-field" class="space-y-4">
          <input type="hidden" name="form-name" value="creative-inquiry" />
          <p class="hidden"><label>Don’t fill this out: <input name="bot-field" /></label></p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Your Name</label>
              <input type="text" name="name" required placeholder="Alex Turner" class="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Contact (Email or X)</label>
              <input type="text" name="contact" required placeholder="alex@channel.com" class="w-full px-3.5 py-2.5 rounded-lg bg-black/50 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors" />
            </div>
          </div>
          <button type="submit" class="w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-lg shadow-blue-600/30">
            Request Production Retainer Quote →
          </button>
        </form>
      </div>
    </section>

    <!-- Conversion Banner -->
    <section class="conversion-banner">
      <h2 class="text-3xl font-bold text-white mb-4">Ready to Engineer High Retention for Your Videos?</h2>
      <p class="text-slate-300 max-w-xl mx-auto mb-8">Book a direct 30-minute creative strategy and retention audit with our lead post-production team.</p>
      <a href="https://calendly.com/resolviaai/meet" target="_blank" rel="noopener noreferrer" class="cta-btn-primary">
        <span>Book Channel Retention Audit</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
      </a>
    </section>
  </main>

  {footer_html}
  <script defer src="/assets/autoscroll.js"></script>
  <script defer src="/assets/analytics.js"></script>
</body>
</html>'''

def sync_ecosystem(compiled_posts):
    """
    Synchronizes compiled posts with sitemap.xml, indexnow.json, netlify.toml,
    llms.txt, llms-full.txt, and blog.html.
    """
    print("\n--- Synchronizing Search Visibility Ecosystem ---")

    # 1. Update sitemap.xml
    sitemap_path = os.path.join(ROOT_DIR, 'sitemap.xml')
    if os.path.exists(sitemap_path):
        with open(sitemap_path, 'r', encoding='utf-8') as f:
            sitemap_content = f.read()

        added_sitemap = 0
        for p in compiled_posts:
            url = f"https://theresolvia.com/blog/{p['slug']}/"
            if url not in sitemap_content:
                entry = f'''  <url>
    <loc>{url}</loc>
    <lastmod>{datetime.utcnow().strftime('%Y-%m-%d')}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.80</priority>
  </url>
'''
                sitemap_content = sitemap_content.replace('</urlset>', entry + '</urlset>')
                added_sitemap += 1

        if added_sitemap > 0:
            with open(sitemap_path, 'w', encoding='utf-8') as f:
                f.write(sitemap_content)
            print(f"✓ sitemap.xml: Added {added_sitemap} new article entries.")
        else:
            print("✓ sitemap.xml: All articles already present.")

    # 2. Update indexnow.json
    indexnow_path = os.path.join(ROOT_DIR, 'indexnow.json')
    if os.path.exists(indexnow_path):
        with open(indexnow_path, 'r', encoding='utf-8') as f:
            in_data = json.load(f)

        added_in = 0
        for p in compiled_posts:
            url = f"https://theresolvia.com/blog/{p['slug']}/"
            if url not in in_data.get('urlList', []):
                in_data['urlList'].append(url)
                added_in += 1

        if added_in > 0:
            with open(indexnow_path, 'w', encoding='utf-8') as f:
                json.dump(in_data, f, indent=2)
            print(f"✓ indexnow.json: Added {added_in} new URLs.")
        else:
            print("✓ indexnow.json: All URLs up to date.")

    # 3. Update netlify.toml
    netlify_path = os.path.join(ROOT_DIR, 'netlify.toml')
    if os.path.exists(netlify_path):
        with open(netlify_path, 'r', encoding='utf-8') as f:
            net_content = f.read()

        added_net = 0
        for p in compiled_posts:
            slug = p['slug']
            from_pattern = f'/blog/{slug}'
            if from_pattern not in net_content:
                rule = f'''[[redirects]]
  from = "/blog/{slug}"
  to = "/blog/{slug}/index.html"
  status = 200

'''
                idx = net_content.find('# Global Security & Performance Headers')
                if idx != -1:
                    net_content = net_content[:idx] + rule + net_content[idx:]
                else:
                    net_content += '\n' + rule
                added_net += 1

        if added_net > 0:
            with open(netlify_path, 'w', encoding='utf-8') as f:
                f.write(net_content)
            print(f"✓ netlify.toml: Added {added_net} clean redirects.")
        else:
            print("✓ netlify.toml: All redirects up to date.")

    # 4. Update llms.txt & llms-full.txt
    for l_name in ['llms.txt', 'llms-full.txt']:
        l_path = os.path.join(ROOT_DIR, l_name)
        if os.path.exists(l_path):
            with open(l_path, 'r', encoding='utf-8') as f:
                llm_txt = f.read()

            added_llm = 0
            for p in compiled_posts:
                url = f"https://theresolvia.com/blog/{p['slug']}/"
                if url not in llm_txt:
                    line = f"- [{p['title']}]({url}): {p['description']}\n"
                    # insert under In-Depth Guides
                    sec_hdr = "## In-Depth Guides & Pricing Reports (AEO/GEO)\n"
                    if sec_hdr in llm_txt:
                        llm_txt = llm_txt.replace(sec_hdr, sec_hdr + line)
                    else:
                        llm_txt += f"\n{line}"
                    added_llm += 1

            if added_llm > 0:
                with open(l_path, 'w', encoding='utf-8') as f:
                    f.write(llm_txt)
                print(f"✓ {l_name}: Added {added_llm} articles for AI engines.")
            else:
                print(f"✓ {l_name}: AI engine documentation up to date.")

    # 5. Update blog.html hub cards
    sync_blog_hub(compiled_posts)


def sync_blog_hub(compiled_posts):
    """
    Renders all compiled markdown posts into the blog.html articles grid,
    ensuring zero orphan articles and fresh cards.
    """
    blog_html_path = os.path.join(ROOT_DIR, 'blog.html')
    if not os.path.exists(blog_html_path):
        return

    with open(blog_html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Build card HTML for all compiled posts
    cards_html = ""
    for p in compiled_posts:
        title = p.get('title', '')
        slug = p.get('slug', '')
        category = p.get('category', 'Retention Science')
        badge = p.get('badge', category)
        desc = p.get('description', '')
        read_time = p.get('readTime', '7 min read')

        cards_html += f'''        <article class="article-card">
          <div>
            <span class="article-category">{badge}</span>
            <h3 class="article-title"><a href="/blog/{slug}/" style="color:inherit; text-decoration:none;" class="hover:text-blue-400 transition-colors">{title} →</a></h3>
            <p class="article-desc">
              {desc}
            </p>
          </div>
          <div class="article-meta">
            <span>{category}</span>
            <span>{read_time}</span>
          </div>
        </article>
'''

    new_section = f'''    <!-- All Editorial & Strategic Guides -->
    <div style="margin: 48px 0 24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:24px;">
        <h2 style="font-size:24px; font-weight:700; color:#ffffff; margin:0;">In-Depth Guides &amp; Research Reports</h2>
        <span style="font-size:13px; color:#2F86F7; font-weight:600;">{len(compiled_posts)} Articles Live</span>
      </div>
      <div class="articles-grid" style="margin-bottom: 48px;">
{cards_html}      </div>
    </div>
'''

    # Replace or insert this section into blog.html
    if '<!-- All Editorial & Strategic Guides -->' in html:
        # replace existing section
        pattern = r'<!-- All Editorial & Strategic Guides -->.*?</div>\s*</div>'
        html = re.sub(pattern, new_section.strip(), html, flags=re.DOTALL)
    elif '<!-- Strategic Buying & Pricing Guides Section -->' in html:
        # replace legacy section with the unified all-articles section
        pattern = r'<!-- Strategic Buying & Pricing Guides Section -->.*?</div>\s*</div>'
        html = re.sub(pattern, new_section.strip(), html, flags=re.DOTALL)
    else:
        # insert before Articles Grid
        idx = html.find('<!-- Articles Grid -->')
        if idx != -1:
            html = html[:idx] + new_section + html[idx:]

    with open(blog_html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"✓ blog.html: Synchronized all {len(compiled_posts)} article cards.")


def sync_supabase_posts():
    """
    Fetches published articles from Supabase 'posts' table and syncs
    them to content/blog/<slug>.md so they are statically compiled for Google.
    """
    import urllib.request
    sp_url = os.environ.get('SUPABASE_URL', 'https://irrewfsdmixunaashckv.supabase.co')
    sp_key = os.environ.get('SUPABASE_KEY', 'sb_publishable_xvpxIf1s8f_D3nQ3dvTZwQ_i1xcD_uO')
    endpoint = f"{sp_url}/rest/v1/posts?select=*&status=eq.published"
    try:
        req = urllib.request.Request(endpoint, headers={
            'apikey': sp_key,
            'Authorization': f'Bearer {sp_key}'
        })
        with urllib.request.urlopen(req, timeout=10) as resp:
            posts = json.loads(resp.read().decode('utf-8'))
            print(f"✓ Supabase Sync: Found {len(posts)} published articles in Supabase.")
            for post in posts:
                slug = post.get('slug')
                if not slug:
                    continue
                content_md = post.get('content_markdown') or ''
                p_title = post.get('title', '').replace('"', '')
                p_desc = post.get('description', '').replace('"', '')
                p_cat = post.get('category', 'Video Editing')
                p_badge = post.get('badge') or p_cat
                p_read = post.get('read_time', '7 min read')
                p_author = post.get('author', 'Resolvia Studio Team')
                p_pub = post.get('created_at', datetime.utcnow().isoformat())
                p_mod = post.get('updated_at', datetime.utcnow().isoformat())
                p_yt = post.get('youtube_id', '')

                frontmatter = f"""---
title: "{p_title}"
slug: "{slug}"
category: "{p_cat}"
badge: "{p_badge}"
readTime: "{p_read}"
author: "{p_author}"
datePublished: "{p_pub}"
dateModified: "{p_mod}"
youtubeId: "{p_yt}"
description: "{p_desc}"
---

{content_md}
"""
                file_path = os.path.join(CONTENT_DIR, f"{slug}.md")
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(frontmatter)
                print(f"  → Synchronized '{slug}.md' from Supabase.")
    except Exception as e:
        print(f"ℹ️ Supabase Sync note (continuing with local content): {e}")

def build_all():
    print("==================================================")
    print("=== RESOLVIA SCALABLE CONTENT ENGINE BUILD ===")
    print("==================================================")
    os.makedirs(CONTENT_DIR, exist_ok=True)
    sync_supabase_posts()
    
    md_files = [f for f in os.listdir(CONTENT_DIR) if f.endswith('.md')]
    print(f"Found {len(md_files)} Markdown articles in {CONTENT_DIR}")

    compiled_posts = []

    for fname in md_files:
        fpath = os.path.join(CONTENT_DIR, fname)
        with open(fpath, 'r', encoding='utf-8') as f:
            raw_text = f.read()

        # Parse frontmatter
        if raw_text.startswith('---'):
            parts = raw_text.split('---', 2)
            if len(parts) >= 3:
                meta = yaml.safe_load(parts[1])
                md_content = parts[2]
            else:
                meta = {}
                md_content = raw_text
        else:
            meta = {}
            md_content = raw_text

        slug = meta.get('slug', os.path.splitext(fname)[0])
        meta['slug'] = slug

        # Convert markdown to HTML
        body_html = markdown.markdown(
            md_content,
            extensions=['tables', 'fenced_code', 'nl2br']
        )

        # Build full page HTML
        full_html = build_article_html(meta, body_html)

        # Output to blog/<slug>/index.html
        target_dir = os.path.join(BLOG_OUTPUT_DIR, slug)
        os.makedirs(target_dir, exist_ok=True)
        target_path = os.path.join(target_dir, 'index.html')
        with open(target_path, 'w', encoding='utf-8') as out_f:
            out_f.write(full_html)

        print(f"✓ Compiled: /blog/{slug}/ ({len(full_html)} bytes)")
        compiled_posts.append(meta)

    # Sync ecosystem assets
    sync_ecosystem(compiled_posts)
    print("\n✅ Build and synchronization complete!")
    return compiled_posts

if __name__ == '__main__':
    build_all()
