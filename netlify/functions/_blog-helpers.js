// Shared blog post parsing, preview image resolution, and Supabase helpers

const SITE_ORIGIN = 'https://theresolvia.com';
const DEFAULT_PREVIEW_PATH = '/assets/blog/agency-vs-freelance-cover.png';

function getSupabaseConfig() {
  const url = (process.env.SUPABASE_URL || 'https://irrewfsdmixunaashckv.supabase.co').replace(/\/+$/, '');
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable_xvpxIf1s8f_D3nQ3dvTZwQ_i1xcD_uO';
  return {
    url,
    readKey: serviceKey || anonKey,
    serviceKey
  };
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeXml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cleanImageUrl(rawUrl) {
  let u = String(rawUrl || '').trim();
  if (!u) return '';
  if (u.startsWith('<') && u.includes('>')) {
    u = u.slice(1, u.indexOf('>')).trim();
  } else if (!u.startsWith('data:')) {
    const spaceIdx = u.search(/\s+["']/);
    if (spaceIdx !== -1) u = u.slice(0, spaceIdx).trim();
  }
  return u;
}

function isSvgUrl(url) {
  return /\.svg(?:[?#].*)?$/i.test(url) || /^data:image\/svg\+xml/i.test(url);
}

function inferImageMime(url) {
  const lower = String(url || '').toLowerCase();
  if (lower.startsWith('data:')) {
    const m = lower.match(/^data:(image\/[a-z0-9.+-]+)[;,]/i);
    if (m) return m[1];
  }
  if (/\.png(?:[?#].*)?$/.test(lower)) return 'image/png';
  if (/\.(?:jpg|jpeg)(?:[?#].*)?$/.test(lower)) return 'image/jpeg';
  if (/\.webp(?:[?#].*)?$/.test(lower)) return 'image/webp';
  if (/\.gif(?:[?#].*)?$/.test(lower)) return 'image/gif';
  return 'image/png';
}

function extractImagesFromMarkdown(markdown) {
  const md = String(markdown || '');
  const results = [];
  const tokenRegex = /!\[([^\]]*)\]\(([^)]+)\)|<img\b[^>]*>/gi;
  let match;
  while ((match = tokenRegex.exec(md)) !== null) {
    if (match[2]) {
      const url = cleanImageUrl(match[2]);
      if (url) results.push({ alt: (match[1] || '').trim(), url });
    } else {
      const tag = match[0];
      const srcM = tag.match(/\bsrc=["']([^"']+)["']/i);
      const altM = tag.match(/\balt=["']([^"']*)["']/i);
      const url = cleanImageUrl(srcM ? srcM[1] : '');
      if (url) results.push({ alt: altM ? altM[1].trim() : '', url });
    }
  }
  return results;
}

function toAbsoluteUrl(url, origin = SITE_ORIGIN) {
  if (!url) return origin + DEFAULT_PREVIEW_PATH;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('/')) return origin + url;
  return origin + '/' + url;
}

function resolvePostPreview(post, origin = SITE_ORIGIN) {
  const explicitCover = cleanImageUrl(post && post.cover_image);
  const inlineImages = extractImagesFromMarkdown(post && post.content_markdown);

  let chosenUrl = '';
  let chosenAlt = '';

  if (explicitCover && !isSvgUrl(explicitCover)) {
    chosenUrl = explicitCover;
    chosenAlt = (post && post.title) || 'Resolvia Editorial Guide';
  } else {
    const nonSvg = inlineImages.find((img) => !isSvgUrl(img.url));
    if (nonSvg) {
      chosenUrl = nonSvg.url;
      chosenAlt = nonSvg.alt || (post && post.title) || 'Resolvia Editorial Guide';
    } else if (explicitCover) {
      chosenUrl = explicitCover;
      chosenAlt = (post && post.title) || 'Resolvia Editorial Guide';
    } else {
      chosenUrl = DEFAULT_PREVIEW_PATH;
      chosenAlt = (post && post.title) || 'Resolvia Editorial Guide';
    }
  }

  let socialUrl = '';
  if (chosenUrl.startsWith('data:image/')) {
    const slug = encodeURIComponent((post && post.slug) || '');
    socialUrl = slug
      ? `${origin}/.netlify/functions/blog-preview-image?slug=${slug}`
      : `${origin}${DEFAULT_PREVIEW_PATH}`;
  } else if (isSvgUrl(chosenUrl)) {
    // Social platforms do not render SVG images in OpenGraph / Twitter cards
    socialUrl = `${origin}${DEFAULT_PREVIEW_PATH}`;
  } else {
    socialUrl = toAbsoluteUrl(chosenUrl, origin);
  }

  const mimeType = chosenUrl.startsWith('data:image/')
    ? inferImageMime(chosenUrl)
    : inferImageMime(socialUrl);

  return {
    socialUrl,
    clientUrl: chosenUrl.startsWith('data:') ? chosenUrl : socialUrl,
    rawDataUrl: chosenUrl.startsWith('data:') ? chosenUrl : null,
    alt: chosenAlt,
    mimeType
  };
}

async function fetchPublishedPosts({ slug = null, select = '*' } = {}) {
  const { url, readKey } = getSupabaseConfig();
  let endpoint = `${url}/rest/v1/posts?status=eq.published&select=${encodeURIComponent(select)}`;
  if (slug) {
    endpoint += `&slug=eq.${encodeURIComponent(slug)}&limit=1`;
  } else {
    endpoint += `&order=created_at.desc`;
  }
  const res = await fetch(endpoint, {
    headers: {
      apikey: readKey,
      Authorization: `Bearer ${readKey}`
    }
  });
  if (!res.ok) {
    throw new Error(`Supabase fetch failed: ${res.status}`);
  }
  return res.json();
}

module.exports = {
  SITE_ORIGIN,
  DEFAULT_PREVIEW_PATH,
  getSupabaseConfig,
  escapeHtml,
  escapeXml,
  extractImagesFromMarkdown,
  resolvePostPreview,
  fetchPublishedPosts
};
