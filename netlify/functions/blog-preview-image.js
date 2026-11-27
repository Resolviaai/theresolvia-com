// Netlify Function: blog-preview-image.js
// Serves binary preview image bytes for posts whose resolved preview is an inline data URI,
// or redirects to the resolved public HTTPS image URL so link scrapers always display previews.

const { SITE_ORIGIN, DEFAULT_PREVIEW_PATH, fetchPublishedPosts, resolvePostPreview } = require('./_blog-helpers');

exports.handler = async function (event) {
  try {
    const slug = (event.queryStringParameters && event.queryStringParameters.slug) || '';
    if (!slug) {
      return {
        statusCode: 302,
        headers: { Location: `${SITE_ORIGIN}${DEFAULT_PREVIEW_PATH}` },
        body: ''
      };
    }

    const rows = await fetchPublishedPosts({
      slug,
      select: 'slug,title,cover_image,content_markdown'
    });

    if (!Array.isArray(rows) || rows.length === 0) {
      return {
        statusCode: 302,
        headers: { Location: `${SITE_ORIGIN}${DEFAULT_PREVIEW_PATH}` },
        body: ''
      };
    }

    const preview = resolvePostPreview(rows[0], SITE_ORIGIN);
    if (preview.rawDataUrl) {
      const m = preview.rawDataUrl.match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i);
      if (m) {
        return {
          statusCode: 200,
          isBase64Encoded: true,
          headers: {
            'Content-Type': m[1],
            'Cache-Control': 'public, max-age=3600'
          },
          body: m[2]
        };
      }
    }

    return {
      statusCode: 302,
      headers: {
        Location: preview.socialUrl || `${SITE_ORIGIN}${DEFAULT_PREVIEW_PATH}`,
        'Cache-Control': 'public, max-age=600'
      },
      body: ''
    };
  } catch (err) {
    console.error('blog-preview-image error:', err);
    return {
      statusCode: 302,
      headers: { Location: `${SITE_ORIGIN}${DEFAULT_PREVIEW_PATH}` },
      body: ''
    };
  }
};
