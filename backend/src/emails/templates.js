// Branded HTML email templates for Weblyne.
// Inline styles only — most clients strip <style>.
// SECURITY: ALL user-supplied values MUST pass through escape() before
// being interpolated into HTML. Never pass raw strings as bodyHtml or intro.

const BRAND = {
  blue: '#185fa5',
  navy: '#042c53',
  ink: '#0f1c33',
  muted: '#5b6b85',
  bg: '#f6f8fb',
  line: '#e2e8f1',
};

/** HTML-escape a value so it is safe to interpolate into HTML attributes or text. */
function escape(s = '') {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Shell email layout.
 * @param {object} opts
 * @param {string} opts.heading     - Plain text; will be escaped.
 * @param {string} [opts.intro]     - Plain text; will be escaped and wrapped in <p>.
 * @param {string} [opts.bodyHtml]  - Pre-built HTML fragment — MUST only contain
 *                                    values that have already been escaped.
 * @param {string} [opts.ctaLabel]  - Plain text; will be escaped.
 * @param {string} [opts.ctaUrl]    - Must be a safe URL (validated at call site).
 * @param {string} [opts.footerNote]- Plain text; will be escaped.
 */
function shell({ heading, intro, bodyHtml, ctaLabel, ctaUrl, footerNote }) {
  // Validate ctaUrl — only allow http/https schemes to prevent javascript: URIs.
  const safeCtaUrl = ctaUrl && /^https?:\/\//i.test(ctaUrl) ? ctaUrl : null;

  return `<!doctype html>
<html><head><meta charset="utf-8"><title>${escape(heading)}</title></head>
<body style="margin:0;padding:0;background:${BRAND.bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${BRAND.ink};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.bg};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:white;border-radius:16px;overflow:hidden;border:1px solid ${BRAND.line};">
        <tr>
          <td style="background:linear-gradient(135deg,${BRAND.blue},${BRAND.navy});padding:24px 32px;color:white;">
            <div style="font-weight:800;font-size:18px;letter-spacing:-0.01em;">Weblyne</div>
            <div style="font-size:12px;opacity:0.8;margin-top:2px;">A studio in Biratnagar, Nepal</div>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h1 style="margin:0 0 12px;font-size:22px;line-height:1.25;color:${BRAND.ink};">${escape(heading)}</h1>
            ${intro ? `<p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${BRAND.muted};">${escape(intro)}</p>` : ''}
            ${bodyHtml || ''}
            ${safeCtaUrl && ctaLabel ? `
              <div style="margin:28px 0 8px;">
                <a href="${escape(safeCtaUrl)}" style="display:inline-block;background:${BRAND.blue};color:white;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;font-size:14px;">${escape(ctaLabel)}</a>
              </div>
            ` : ''}
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:${BRAND.bg};font-size:12px;color:${BRAND.muted};border-top:1px solid ${BRAND.line};">
            ${escape(footerNote || 'Weblyne · Main Road, Biratnagar · hello@weblyne.np')}
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

export function adminNotificationEmail(c) {
  const rows = [
    ['Name', c.name],
    ['Email', c.email],
    ['Phone', c.phone || '—'],
    ['Service', c.service || '—'],
    ['Budget', c.budget || '—'],
  ].map(([k, v]) => `
    <tr>
      <td style="padding:8px 12px;font-size:13px;color:${BRAND.muted};border-bottom:1px solid ${BRAND.line};">${escape(k)}</td>
      <td style="padding:8px 12px;font-size:14px;color:${BRAND.ink};font-weight:600;border-bottom:1px solid ${BRAND.line};">${escape(v || '')}</td>
    </tr>`).join('');

  const bodyHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND.line};border-radius:12px;overflow:hidden;margin-bottom:20px;">
      ${rows}
    </table>
    <div style="font-size:12px;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.06em;margin-bottom:8px;">Project description</div>
    <div style="white-space:pre-wrap;font-size:15px;line-height:1.6;color:${BRAND.ink};background:${BRAND.bg};padding:16px;border-radius:10px;border:1px solid ${BRAND.line};">${escape(c.description || '')}</div>
  `;

  const subject = `New enquiry: ${c.name} — ${c.service || 'general'}`;
  const text = [
    'New enquiry on weblyne.np',
    `Name: ${c.name}`,
    `Email: ${c.email}`,
    `Phone: ${c.phone || '—'}`,
    `Service: ${c.service || '—'}`,
    `Budget: ${c.budget || '—'}`,
    '',
    c.description || '',
  ].join('\n');

  // ctaUrl must be a safe absolute URL — use FRONTEND_URL env or fall back to
  // the known production domain (never allow user-supplied values here).
  const adminUrl = process.env.FRONTEND_URL
    ? `${process.env.FRONTEND_URL}/admin`
    : 'https://weblyne.vercel.app/admin';

  const html = shell({
    heading: 'New project enquiry',
    intro: 'A new enquiry just came through your website.',
    bodyHtml,
    ctaLabel: 'Open admin dashboard',
    ctaUrl: adminUrl,
  });

  return { subject, html, text };
}

export function clientConfirmationEmail(c) {
  const firstName = escape((c.name || 'there').split(' ')[0]);
  const subject = `We got your enquiry, ${(c.name || 'there').split(' ')[0]} — Weblyne`;

  const bodyHtml = `
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${BRAND.ink};">
      Thanks for reaching out about <strong>${escape(c.service || 'your project')}</strong>.
      We've received your message and a real human will reply within 24 hours — usually a lot sooner.
    </p>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${BRAND.ink};">
      In the meantime, if anything is urgent, you can ping us on WhatsApp at <strong>+977 9815 864 822</strong>.
    </p>
    <div style="margin-top:20px;padding:14px 16px;background:${BRAND.bg};border-radius:10px;border:1px solid ${BRAND.line};font-size:13px;color:${BRAND.muted};">
      <strong style="color:${BRAND.ink};">Your enquiry summary</strong><br/>
      ${escape((c.description || '').slice(0, 400))}
    </div>
  `;

  const text = `Hi ${(c.name || 'there').split(' ')[0]},\n\nThanks for reaching out about ${c.service || 'your project'}. We'll reply within 24 hours.\n\n— Weblyne\nhello@weblyne.np`;

  const frontendUrl = process.env.FRONTEND_URL || 'https://weblyne.vercel.app';

  const html = shell({
    heading: `Thanks, ${firstName}.`,
    intro: "We received your project enquiry. Here's what happens next.",
    bodyHtml,
    ctaLabel: 'Visit weblyne.np',
    ctaUrl: frontendUrl,
    footerNote: "You're receiving this because you submitted an enquiry on weblyne.np.",
  });

  return { subject, html, text };
}
