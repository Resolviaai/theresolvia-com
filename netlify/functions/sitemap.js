// Netlify Function: sitemap.js
// Generates live XML sitemap combining core static routes with every published Supabase blog post

const { SITE_ORIGIN, escapeXml, resolvePostPreview, fetchPublishedPosts } = require('./_blog-helpers');

const STATIC_URLS = [
  { loc: `${SITE_ORIGIN}/`, lastmod: '2026-11-27', changefreq: 'daily', priority: '1.0' },
  { loc: `${SITE_ORIGIN}/blog.html`, lastmod: '2026-11-27', changefreq: 'daily', priority: '0.9' },
  { loc: `${SITE_ORIGIN}/services/youtube-video-editing/`, lastmod: '2026-11-26', changefreq: 'weekly', priority: '0.95' },
  { loc: `${SITE_ORIGIN}/services/short-form-video-editing/`, lastmod: '2026-11-26', changefreq: 'weekly', priority: '0.95' },
  { loc: `${SITE_ORIGIN}/services/podcast-video-editing/`, lastmod: '2026-11-26', changefreq: 'weekly', priority: '0.90' },
  { loc: `${SITE_ORIGIN}/services/video-ad-editing/`, lastmod: '2026-11-26', changefreq: 'weekly', priority: '0.90' },
  { loc: `${SITE_ORIGIN}/for/creators/`, lastmod: '2026-11-24', changefreq: 'weekly', priority: '0.85' },
  { loc: `${SITE_ORIGIN}/for/businesses/`, lastmod: '2026-11-24', changefreq: 'weekly', priority: '0.85' },
  { loc: `${SITE_ORIGIN}/for/agencies/`, lastmod: '2026-11-24', changefreq: 'weekly', priority: '0.85' },
  { loc: `${SITE_ORIGIN}/careers.html`, lastmod: '2026-11-24', changefreq: 'monthly', priority: '0.75' },
  { loc: `${SITE_ORIGIN}/security.html`, lastmod: '2026-11-24', changefreq: 'monthly', priority: '0.70' },
  { loc: `${SITE_ORIGIN}/terms.html`, lastmod: '2026-11-24', changefreq: 'monthly', priority: '0.50' },
  { loc: `${SITE_ORIGIN}/privacy.html`, lastmod: '2026-11-24', changefreq: 'monthly', priority: '0.50' },
  { loc: `${SITE_ORIGIN}/super-search/`, lastmod: '2026-11-24', changefreq: 'weekly', priority: '0.90' },
  { loc: `${SITE_ORIGIN}/mcp/`, lastmod: '2026-11-24', changefreq: 'monthly', priority: '0.85' },
  { loc: `${SITE_ORIGIN}/copilot/`, lastmod: '2026-11-24', changefreq: 'monthly', priority: '0.85' },
  { loc: `${SITE_ORIGIN}/script-studio/`, lastmod: '2026-11-24', changefreq: 'monthly', priority: '0.85' },
  { loc: `${SITE_ORIGIN}/auto-editing/`, lastmod: '2026-11-24', changefreq: 'monthly', priority: '0.85' }
];

exports.handler = async function () {
  let posts = [];
  try {
    posts = await fetchPublishedPosts({
      select: 'slug,title,cover_image,content_markdown,updated_at,created_at'
    });
    if (!Array.isArray(posts)) posts = [];
  } catch (err) {
    console.warn('Dynamic sitemap Supabase warning:', err.message);
  }

  const staticXml = STATIC_URLS.map(
    (u) => `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <lastmod>${escapeXml(u.lastmod)}</lastmod>
    <changefreq>${escapeXml(u.changefreq)}</changefreq>
    <priority>${escapeXml(u.priority)}</priority>
  </url>`
  ).join('\n');

  const postXml = posts
    .filter((p) => p && p.slug)
    .map((p) => {
      const postUrl = `${SITE_ORIGIN}/blog/${encodeURIComponent(p.slug)}/`;
      const lastmod = String(p.updated_at || p.created_at || new Date().toISOString()).slice(0, 10);
      const preview = resolvePostPreview(p, SITE_ORIGIN);
      const imgBlock = preview.socialUrl
        ? `\n    <image:image>\n      <image:loc>${escapeXml(preview.socialUrl)}</image:loc>\n      <image:title>${escapeXml(p.title || '')}</image:title>\n      <image:caption>${escapeXml(preview.alt || p.title || '')}</image:caption>\n    </image:image>`
        : '';
      return `  <url>
    <loc>${escapeXml(postUrl)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>${imgBlock}
  </url>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${staticXml}
${postXml}
</urlset>
`;

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=300, must-revalidate'
    },
    body: xml
  };
};
