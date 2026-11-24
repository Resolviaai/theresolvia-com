// ==============================================================================
// Netlify Serverless Function: submit-lead.js
// Resolvia Creative Studio - Secure Inbound Lead Dispatcher
// - Persists lead into Supabase Database (service role)
// - Dispatches instant real-time alert via Resend API to resolviaai@gmail.com
// ==============================================================================

exports.handler = async function(event, context) {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    let payload = {};

    // Support both application/json and application/x-www-form-urlencoded
    const contentType = event.headers['content-type'] || event.headers['Content-Type'] || '';
    if (contentType.includes('application/json')) {
      payload = JSON.parse(event.body || '{}');
    } else {
      const params = new URLSearchParams(event.body);
      payload = Object.fromEntries(params.entries());
    }

    const name = (payload.name || '').trim();
    const email = (payload.email || '').trim();
    const format = (payload.format || 'Short-Form (Shorts / Reels / TikTok)').trim();
    const channel = (payload.channel || payload.channel_url || '').trim();
    const notes = (payload.notes || payload.project_details || '').trim();

    // Check honeypot anti-spam
    if (payload['bot-field']) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, message: 'Spam caught' })
      };
    }

    if (!name || !email) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Name and Work Email are required.' })
      };
    }

    // 1. Persist to Supabase Database
    const supabaseUrl = process.env.SUPABASE_URL || 'https://irrewfsdmixunaashckv.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    let supabaseSaved = false;
    if (supabaseUrl && supabaseKey) {
      try {
        const leadRow = {
          name: name,
          email: email,
          format: format,
          portfolio_id: '3a5f9737-142f-48d6-95af-ec090287a38b',
          portfolio_url: channel || 'https://theresolvia.com',
          channel_url: channel,
          notes: notes,
          project_details: notes, // supports legacy column name
          status: 'new',
          source_page: payload.source_page || '/',
          created_at: new Date().toISOString()
        };

        const spRes = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(leadRow)
        });

        if (spRes.ok) {
          supabaseSaved = true;
        } else {
          console.warn('Supabase lead insert note:', await spRes.text());
        }
      } catch (dbErr) {
        console.error('Supabase insert error:', dbErr);
      }
    }

    // 2. Dispatch Real-time Notification via Resend API
    const resendApiKey = process.env.RESEND_API_KEY;
    const notificationEmail = process.env.NOTIFICATION_EMAIL || 'resolviaai@gmail.com';

    let emailSent = false;
    if (resendApiKey) {
      try {
        const emailHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0e0f11; color: #e2e8f0; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; overflow: hidden; padding: 28px 24px;">
            <div style="border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 18px; margin-bottom: 22px;">
              <span style="display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; background: rgba(47,134,247,0.15); color: #38BAFE; border: 1px solid rgba(47,134,247,0.3); border-radius: 9999px; padding: 3px 10px; margin-bottom: 8px;">
                New Inbound Lead
              </span>
              <h1 style="font-size: 20px; font-weight: 800; color: #ffffff; margin: 0; letter-spacing: -0.02em;">
                ${name} requested a Sample Cut Proposal
              </h1>
            </div>

            <table style="width: 100%; border-collapse: collapse; font-size: 13.5px; line-height: 1.6; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; color: rgba(255,255,255,0.5); width: 140px; font-weight: 500;">Name / Creator:</td>
                <td style="padding: 8px 0; color: #ffffff; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: rgba(255,255,255,0.5); font-weight: 500;">Work Email:</td>
                <td style="padding: 8px 0;">
                  <a href="mailto:${email}" style="color: #2F86F7; text-decoration: none; font-weight: 600;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: rgba(255,255,255,0.5); font-weight: 500;">Format:</td>
                <td style="padding: 8px 0; color: #e2e8f0;">${format}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: rgba(255,255,255,0.5); font-weight: 500;">Channel / Footage:</td>
                <td style="padding: 8px 0;">
                  ${channel ? `<a href="${channel}" target="_blank" style="color: #38BAFE; word-break: break-all;">${channel}</a>` : '<span style="color: rgba(255,255,255,0.3);">None provided</span>'}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: rgba(255,255,255,0.5); font-weight: 500; vertical-align: top;">Challenge / Notes:</td>
                <td style="padding: 8px 0; color: #e2e8f0; background: rgba(255,255,255,0.03); border-radius: 8px; padding: 10px 12px;">
                  ${notes || '<span style="color: rgba(255,255,255,0.3);">None provided</span>'}
                </td>
              </tr>
            </table>

            <div style="text-align: center; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.08);">
              <a href="https://theresolvia.com/admin/" style="display: inline-block; background: #2F86F7; color: #ffffff; font-size: 13px; font-weight: 700; text-decoration: none; padding: 10px 22px; border-radius: 10px;">
                Open Resolvia CRM &rarr;
              </a>
            </div>
          </div>
        `;

        const resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Resolvia-App/1.0'
          },
          body: JSON.stringify({
            from: 'Resolvia Studio <onboarding@resend.dev>',
            to: [notificationEmail],
            subject: `New Lead: ${name} · ${format}`,
            html: emailHtml
          })
        });

        if (resendRes.ok) {
          emailSent = true;
        } else {
          console.warn('Resend email dispatch note:', await resendRes.text());
        }
      } catch (mailErr) {
        console.error('Resend email error:', mailErr);
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        savedToDatabase: supabaseSaved,
        emailDispatched: emailSent
      })
    };
  } catch (error) {
    console.error('submit-lead function fatal error:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Internal server error' })
    };
  }
};
