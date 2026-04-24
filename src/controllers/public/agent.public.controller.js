// controllers/public/agent.public.controller.js
const AgentService = require('../../services/agent.service');
const ApiError = require('../../utils/apiError.util');

const STATE_MESSAGE = {
    verified: 'Agent verified successfully',
    inactive: 'Agent is currently inactive',
    expired: 'Agent has expired',
    invalid: 'Invalid agent code'
};

function escapeHtml(value) {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function renderVerificationPage(state, agent) {
    const palette = {
        verified: { bg: '#0e7c3a', accent: '#10b981', label: '✔ Verified Agent', sub: 'Official Bingold Verified Ambassador' },
        inactive: { bg: '#a16207', accent: '#f59e0b', label: '⚠ Agent Not Active', sub: 'This agent is currently inactive or suspended.' },
        expired:  { bg: '#9a3412', accent: '#f97316', label: '⏰ Agent Expired', sub: 'This agent\'s verification has expired.' },
        invalid:  { bg: '#991b1b', accent: '#ef4444', label: '✖ Invalid Code', sub: 'This agent does not exist. Please check the code or contact support.' }
    }[state] || { bg: '#374151', accent: '#6b7280', label: 'Verification Result', sub: '' };

    const photoBlock = agent && agent.photo
        ? `<img class="photo" src="${escapeHtml(agent.photo)}" alt="Agent photo" />`
        : `<div class="photo placeholder">${agent ? escapeHtml((agent.name || '?').charAt(0).toUpperCase()) : '?'}</div>`;

    const detailRows = agent ? `
        <div class="row"><span>Name</span><strong>${escapeHtml(agent.name)}</strong></div>
        ${agent.role ? `<div class="row"><span>Role</span><strong>${escapeHtml(agent.role)}</strong></div>` : ''}
        ${agent.region ? `<div class="row"><span>Region</span><strong>${escapeHtml(agent.region)}</strong></div>` : ''}
        <div class="row"><span>Code</span><strong>${escapeHtml(agent.unique_code)}</strong></div>
        <div class="row"><span>Status</span><strong style="text-transform:capitalize">${escapeHtml(agent.status)}</strong></div>
        ${agent.expiry_date ? `<div class="row"><span>Valid Until</span><strong>${escapeHtml(agent.expiry_date)}</strong></div>` : ''}
    ` : '';

    return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Bingold Agent Verification</title>
<style>
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:linear-gradient(135deg,#111827,#1f2937);display:flex;align-items:center;justify-content:center;padding:24px;color:#111}
  .card{width:100%;max-width:380px;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.35)}
  .banner{background:${palette.bg};color:#fff;padding:22px 20px;text-align:center}
  .banner h1{margin:0;font-size:20px;letter-spacing:.3px}
  .banner p{margin:6px 0 0;font-size:13px;opacity:.9}
  .hero{display:flex;justify-content:center;margin-top:-36px}
  .photo{width:96px;height:96px;border-radius:50%;border:4px solid #fff;object-fit:cover;background:#e5e7eb;box-shadow:0 6px 18px rgba(0,0,0,.15)}
  .photo.placeholder{display:flex;align-items:center;justify-content:center;font-size:38px;font-weight:600;color:#fff;background:${palette.accent}}
  .body{padding:18px 22px 24px}
  .row{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #f3f4f6;font-size:14px}
  .row:last-child{border-bottom:0}
  .row span{color:#6b7280}
  .row strong{color:#111827;text-align:right;word-break:break-word}
  .footer{text-align:center;font-size:11px;color:#6b7280;padding:14px;background:#f9fafb}
</style>
</head>
<body>
  <div class="card">
    <div class="banner">
      <h1>${palette.label}</h1>
      <p>${palette.sub}</p>
    </div>
    ${agent ? `<div class="hero">${photoBlock}</div>` : ''}
    ${agent ? `<div class="body">${detailRows}</div>` : ''}
    <div class="footer">© Bingold · Verification powered by secure QR</div>
  </div>
</body>
</html>`;
}

class PublicAgentController {
    async verifyAgent(req, res, next) {
        try {
            const code = req.params.code || req.body.code || req.query.code;
            if (!code) throw new ApiError(400, 'Agent code is required');

            const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || req.socket?.remoteAddress;
            const user_agent = req.headers['user-agent'];

            const { state, agent } = await AgentService.verifyAgentByCode(code, { ip, user_agent });

            const httpStatus = state === 'invalid' ? 404 : 200;

            res.status(httpStatus).json({
                success: state === 'verified',
                message: STATE_MESSAGE[state] || 'Verification result',
                data: {
                    state,
                    verified: state === 'verified',
                    agent
                }
            });
        } catch (error) {
            next(error);
        }
    }

    // GET handler — what a phone hits when scanning the QR. Returns an HTML
    // verification card so anyone can scan and see results without a frontend.
    async verifyAgentPage(req, res, next) {
        try {
            const code = req.params.code || req.query.code;
            if (!code) {
                res.status(400).type('html').send(renderVerificationPage('invalid', null));
                return;
            }

            const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || req.socket?.remoteAddress;
            const user_agent = req.headers['user-agent'];

            const { state, agent } = await AgentService.verifyAgentByCode(code, { ip, user_agent });

            const httpStatus = state === 'invalid' ? 404 : 200;
            res.status(httpStatus).type('html').send(renderVerificationPage(state, agent));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PublicAgentController();
