// Netlify Function: upload-blog-media.js
// Securely uploads blog images from /admin/ into Supabase public Storage bucket `blog-media`

const { getSupabaseConfig } = require('./_blog-helpers');

const ALLOWED_MIME = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif'
};

exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { url: supabaseUrl, serviceKey } = getSupabaseConfig();
    if (!serviceKey) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Storage service key not configured' })
      };
    }

    const body = JSON.parse(event.body || '{}');
    let contentType = String(body.contentType || '').toLowerCase().trim();
    let base64Data = String(body.base64Data || '').trim();

    if (base64Data.startsWith('data:')) {
      const m = base64Data.match(/^data:(image\/[a-z0-9.+-]+);base64,(.+)$/i);
      if (!m) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid image data URL' })
        };
      }
      contentType = m[1].toLowerCase();
      base64Data = m[2];
    }

    const ext = ALLOWED_MIME[contentType];
    if (!ext) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Unsupported image format. Use PNG, JPG, WEBP, or GIF.' })
      };
    }

    const buffer = Buffer.from(base64Data, 'base64');
    if (!buffer.length || buffer.length > 9 * 1024 * 1024) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Image must be non-empty and under 9 MB.' })
      };
    }

    const rawName = String(body.filename || 'blog-image')
      .replace(/\.[^/.]+$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 60) || 'blog-image';

    const slugPrefix = String(body.slug || 'posts')
      .toLowerCase()
      .replace(/[^a-z0-9-_]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 50) || 'posts';

    const objectPath = `${slugPrefix}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${rawName}.${ext}`;
    const uploadEndpoint = `${supabaseUrl}/storage/v1/object/blog-media/${objectPath}`;

    const uploadRes = await fetch(uploadEndpoint, {
      method: 'POST',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        'Content-Type': contentType,
        'x-upsert': 'true'
      },
      body: buffer
    });

    if (!uploadRes.ok) {
      const errTxt = await uploadRes.text();
      return {
        statusCode: 502,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: `Storage upload failed: ${errTxt}` })
      };
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/blog-media/${objectPath}`;
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ url: publicUrl, path: objectPath })
    };
  } catch (err) {
    console.error('upload-blog-media error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message || 'Upload failed' })
    };
  }
};
