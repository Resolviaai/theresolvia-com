// Netlify Function: blog-post.js
// Server-side meta, OpenGraph, Twitter card, Schema JSON-LD, and preloaded payload injection for /blog/*

const fs = require('fs');
const path = require('path');
const { SITE_ORIGIN, escapeHtml, resolvePostPreview, fetchPublishedPosts } = require('./_blog-helpers');

let cachedTemplate = null;

function loadTemplate() {
  if (cachedTemplate) return cachedTemplate;
  const candidates = [
    path.resolve(process.cwd(), 'blog/post.html'),
    path.resolve(__dirname, '../../blog/post.html'),
    path.resolve(__dirname, '../blog/post.html'),
    path.resolve(__dirname, 'blog/post.html')
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      cachedTemplate = fs.readFileSync(p, 'utf8');
      return cachedTemplate;
    }
  }
  throw new Error('blog/post.html template not found in bundle');
}

function replaceMetaTag(html, attrName, attrVal, newContent) {
  const escaped = escapeHtml(newContent);
  const re = new RegExp(`(<meta\\s+[^>]*${attrName}=["']${attrVal}["'][^>]*content=)["'][^"']*["']`, 'i');
  if (re.test(html)) {
    return html.replace(re, `$1"${escaped}"`);
  }
  return html.replace('</head>', `  <meta ${attrName}="${attrVal}" content="${escaped}"/>\n</head>`);
}

function buildJsonLd(post, canonicalUrl, preview) {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: post.title || 'Resolvia Studio Guide',
        description: post.description || '',
        author: {
          '@type': 'Organization',
          name: post.author || 'Resolvia Studio Team'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Resolvia',
          url: `${SITE_ORIGIN}/`,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_ORIGIN}/brand/resolvia_r_logo.png`
          }
        },
        datePublished: post.created_at || new Date().toISOString(),
        dateModified: post.updated_at || post.created_at || new Date().toISOString(),
        mainEntityOfPage: canonicalUrl,
        image: {
          '@type': 'ImageObject',
          url: preview.socialUrl,
          caption: preview.alt || post.title || ''
        }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: `${SITE_ORIGIN}/`
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: `${SITE_ORIGIN}/blog.html`
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: post.title || 'Article',
            item: canonicalUrl
          }
        ]
      }
    ]
  };
  return JSON.stringify(graph, null, 2).replace(/<\//g, '<\\/');
}

exports.handler = async function (event) {
  try {
    let html = loadTemplate();

    const rawPath = (event.path || '').replace(/^\/\.netlify\/functions\/blog-post\/?/, '');
    const qsSlug = event.queryStringParameters && event.queryStringParameters.slug;
    let slug = qsSlug || '';

    if (!slug) {
      const cleaned = rawPath.replace(/^\/|\/$/g, '');
      const parts = cleaned.split('/').filter(Boolean);
      if (parts[0] === 'blog' && parts[1] && parts[1] !== 'post.html') {
        slug = parts[1];
      } else if (parts[0] && parts[0] !== 'blog' && parts[0] !== 'post.html') {
        slug = parts[0];
      }
    }

    if (!slug) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        body: html
      };
    }

    const rows = await fetchPublishedPosts({ slug, select: '*' });
    if (!Array.isArray(rows) || rows.length === 0) {
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=60'
        },
        body: html
      };
    }

    const post = rows[0];
    const originHeaderHost = (event.headers && (event.headers['x-forwarded-host'] || event.headers.host)) || '';
    const origin = originHeaderHost.includes('localhost') ? `http://${originHeaderHost}` : SITE_ORIGIN;
    const canonicalUrl = `${SITE_ORIGIN}/blog/${encodeURIComponent(post.slug)}/`;
    const preview = resolvePostPreview(post, origin);
    const fullTitle = `${post.title || 'Article'} · Resolvia Studio`;
    const description = post.description || 'Retention-engineered post-production blueprints and video editing architecture from Resolvia Studio.';

    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(fullTitle)}</title>`);
    html = replaceMetaTag(html, 'name', 'description', description);
    html = html.replace(/(<link\s+rel=["']canonical["']\s+href=)["'][^"']*["']/i, `$1"${escapeHtml(canonicalUrl)}"`);

    html = replaceMetaTag(html, 'property', 'og:title', post.title || fullTitle);
    html = replaceMetaTag(html, 'property', 'og:description', description);
    html = replaceMetaTag(html, 'property', 'og:url', canonicalUrl);
    html = replaceMetaTag(html, 'property', 'og:image', preview.socialUrl);

    const extraOgTags = [
      `  <meta property="og:image:secure_url" content="${escapeHtml(preview.socialUrl)}"/>`,
      `  <meta property="og:image:type" content="${escapeHtml(preview.mimeType)}"/>`,
      `  <meta property="og:image:alt" content="${escapeHtml(preview.alt)}"/>`,
      `  <meta name="twitter:image:alt" content="${escapeHtml(preview.alt)}"/>`
    ].join('\n');
    html = html.replace('</head>', `${extraOgTags}\n</head>`);

    html = replaceMetaTag(html, 'name', 'twitter:title', post.title || fullTitle);
    html = replaceMetaTag(html, 'name', 'twitter:description', description);
    html = replaceMetaTag(html, 'name', 'twitter:image', preview.socialUrl);

    const jsonLd = buildJsonLd(post, canonicalUrl, preview);
    html = html.replace(
      /<script\s+type=["']application\/ld\+json["']\s*>[\s\S]*?<\/script>/i,
      `<script type="application/ld+json">\n${jsonLd}\n  </script>`
    );

    const safePostJson = JSON.stringify(post).replace(/<\//g, '<\\/');
    html = html.replace(
      '</head>',
      `  <script id="resolvia-preloaded-post">window.__PRELOADED_POST__ = ${safePostJson};</script>\n</head>`
    );

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=120, must-revalidate'
      },
      body: html
    };
  } catch (err) {
    console.error('blog-post SSR error:', err);
    try {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        body: loadTemplate()
      };
    } catch (_) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
        body: 'Internal Server Error'
      };
    }
  }
};
