// services/emailServices.js
const nodemailer = require('nodemailer');

const isProd = String(process.env.NODE_ENV).toLowerCase() === 'production';

/* ------------ URL Helpers ------------ */
const stripTrailingSlash = (u) => (u ? u.replace(/\/+$/, '') : '');
const stripLeadingSlash = (u) => (u ? u.replace(/^\/+/, '') : '');
const joinUrl = (base, path) =>
  `${stripTrailingSlash(base)}/${stripLeadingSlash(path || '')}`;

function resolveClientUrl() {
  const direct = process.env.CLIENT_URL || process.env.PUBLIC_CLIENT_URL;
  if (direct && direct.trim()) return stripTrailingSlash(direct.trim());
  const list = process.env.CLIENT_URLS;
  if (list && list.trim()) {
    const first = list.split(',')[0].trim();
    if (first) return stripTrailingSlash(first);
  }
  return '';
}

function resolveBackendUrl() {
  return stripTrailingSlash(
    process.env.PUBLIC_API_BASE ||
      process.env.API_BASE ||
      process.env.RENDER_EXTERNAL_URL ||
      'http://localhost:5000'
  );
}

/* ------------ Security Helpers ------------ */
function htmlEscape(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* ------------ Transport ------------ */
function createTransporter() {
  // SMTP_* env’leri önceliklendir; yoksa Gmail app password; yoksa stream
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT || 465);
  const smtpSecure = String(process.env.SMTP_SECURE ?? (smtpPort === 465)).toLowerCase() === 'true';

  const smtpUser = process.env.SMTP_USER || process.env.EMAIL_USER;
  const smtpPass = process.env.SMTP_PASS || process.env.EMAIL_PASS;

  if (smtpUser && smtpPass) {
    return nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: { user: smtpUser, pass: smtpPass },
      pool: isProd, // prod’da havuz aç
      maxConnections: 5,
      maxMessages: 100,
      connectionTimeout: 15_000,
      greetingTimeout: 7_000,
      socketTimeout: 20_000,
    });
  }

  // Dev/test fallback: ağ üzerinden göndermeyip içeriği logla
  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'unix',
    buffer: true,
  });
}

function buildFromHeader() {
  const display = process.env.EMAIL_FROM_NAME || 'Ulgen';
  const addr =
    process.env.SMTP_USER ||
    process.env.EMAIL_USER ||
    'no-reply@ulgen.local';
  return `"${display}" <${addr}>`;
}

function buildHeaders() {
  const unsubscribeHttp =
    process.env.UNSUBSCRIBE_URL || joinUrl(resolveClientUrl() || resolveBackendUrl(), 'unsubscribe');
  const unsubscribeMail = process.env.UNSUBSCRIBE_MAILTO || 'mailto:no-reply@ulgen.local?subject=unsubscribe';
  return {
    'List-Unsubscribe': `<${unsubscribeHttp}>, <${unsubscribeMail}>`,
    'X-Entity-Ref-ID': Date.now().toString(36),
  };
}

/* ------------ Templating ------------ */
function verificationTemplate({ username, verificationUrl, logoUrl }) {
  const safeName = htmlEscape(username || 'kullanıcı');
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>E-posta Doğrulama</title>
  <style>
    body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; line-height:1.6; color:#e2e8f0; background:#0f172a; margin:0; padding:24px; }
    .outer { max-width:640px; margin:0 auto; background:linear-gradient(180deg,#0f172a,#111827); border:1px solid #1f2937; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,.4); }
    .header { text-align:center; padding:28px 24px; background:radial-gradient(1200px 1200px at 50% -200px, rgba(59,130,246,.25), transparent 60%); }
    .logo { width:72px; height:72px; border-radius:50%; border:3px solid #374151; display:inline-block; }
    h1 { color:#f3f4f6; margin:12px 0 6px; font-size:24px; }
    .subtitle { color:#9ca3af; font-size:14px; }
    .container { padding:32px 28px; }
    .card { background:rgba(31,41,55,.6); border:1px solid #374151; border-radius:14px; padding:24px; }
    .content { color:#d1d5db; }
    .button { display:inline-block; background:linear-gradient(90deg,#2563eb,#1d4ed8); color:#fff !important; padding:14px 28px; text-decoration:none; border-radius:10px; font-weight:700; letter-spacing:.2px; box-shadow:0 8px 20px rgba(37,99,235,.35); border:2px solid #1d4ed8; }
    .muted { color:#9ca3af; font-size:12px; }
    .code { word-break:break-all; background:#0b1220; color:#cbd5e1; padding:12px; border-radius:8px; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; border:1px solid #1f2937; }
    .footer { text-align:center; padding:20px; border-top:1px solid #1f2937; color:#6b7280; font-size:12px; }
    .warning { background:rgba(239,68,68,.15); color:#fecaca; padding:12px; border-radius:10px; border:1px solid rgba(239,68,68,.35); }
  </style>
</head>
<body>
  <div class="outer">
    <div class="header">
      <img class="logo" src="${logoUrl}" alt="Ulgen Logo" />
      <h1>Ulgen'e Hoş Geldiniz!</h1>
      <p class="subtitle">E-posta adresinizi doğrulayın</p>
    </div>
    <div class="container">
      <div class="card content">
        <p>Merhaba <strong>${safeName}</strong>,</p>
        <p>Hesabınızı aktifleştirmek için aşağıdaki butona tıklayarak e-posta adresinizi doğrulayın.</p>
        <div style="text-align:center; margin:22px 0 18px;">
          <a href="${verificationUrl}" class="button">E-postamı Doğrula</a>
        </div>
        <p class="muted">Buton çalışmıyorsa aşağıdaki linki kopyalayıp tarayıcınıza yapıştırın:</p>
        <p class="code">${verificationUrl}</p>
        <div class="warning">Bu doğrulama bağlantısı <strong>7 gün</strong> geçerlidir.</div>
      </div>
    </div>
    <div class="footer">Bu e-postayı siz talep etmediyseniz, lütfen dikkate almayın. • © Ulgen</div>
  </div>
</body>
</html>`;

  const text = [
    `Merhaba ${username || 'kullanıcı'},`,
    `E-posta adresinizi doğrulamak için bağlantı:`,
    `${verificationUrl}`,
    ``,
    `Bu bağlantı 7 gün geçerlidir.`,
  ].join('\n');

  return { html, text };
}

function resetTemplate({ username, resetUrl, logoUrl }) {
  const safeName = htmlEscape(username || 'kullanıcı');
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Şifre Sıfırlama</title>
  <style>
    body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; line-height:1.6; color:#e2e8f0; background:#0f172a; margin:0; padding:24px; }
    .outer { max-width:640px; margin:0 auto; background:linear-gradient(180deg,#0f172a,#111827); border:1px solid #1f2937; border-radius:16px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,.4); }
    .header { text-align:center; padding:28px 24px; background:radial-gradient(1200px 1200px at 50% -200px, rgba(239,68,68,.22), transparent 60%); }
    .logo { width:72px; height:72px; border-radius:50%; border:3px solid #374151; display:inline-block; }
    h1 { color:#f3f4f6; margin:12px 0 6px; font-size:24px; }
    .subtitle { color:#9ca3af; font-size:14px; }
    .container { padding:32px 28px; }
    .card { background:rgba(31,41,55,.6); border:1px solid #374151; border-radius:14px; padding:24px; }
    .content { color:#d1d5db; }
    .button { display:inline-block; background:linear-gradient(90deg,#2563eb,#1d4ed8); color:#fff; padding:14px 28px; text-decoration:none; border-radius:10px; font-weight:700; letter-spacing:.2px; box-shadow:0 8px 20px rgba(37,99,235,.35); }
    .muted { color:#9ca3af; font-size:12px; }
    .code { word-break:break-all; background:#0b1220; color:#cbd5e1; padding:12px; border-radius:8px; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; border:1px solid #1f2937; }
    .footer { text-align:center; padding:20px; border-top:1px solid #1f2937; color:#6b7280; font-size:12px; }
    .warning { background:rgba(239,68,68,.15); color:#fecaca; padding:12px; border-radius:10px; border:1px solid rgba(239,68,68,.35); }
  </style>
</head>
<body>
  <div class="outer">
    <div class="header">
      <img class="logo" src="${logoUrl}" alt="Ulgen Logo" />
      <h1>Şifre Sıfırlama</h1>
      <p class="subtitle">Hesabınızın şifresini sıfırlayın</p>
    </div>
    <div class="container">
      <div class="card content">
        <p>Merhaba <strong>${safeName}</strong>,</p>
        <p>Yeni şifre oluşturmak için aşağıdaki butona tıklayın.</p>
        <div style="text-align:center; margin:22px 0 18px;">
          <a href="${resetUrl}" class="button">Şifremi Sıfırla</a>
        </div>
        <p class="muted">Buton çalışmıyorsa aşağıdaki linki kopyalayıp tarayıcınıza yapıştırın:</p>
        <p class="code">${resetUrl}</p>
        <div class="warning">Bu bağlantı <strong>10 dakika</strong> geçerlidir.</div>
        <p class="muted">Bu talebi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın.</p>
      </div>
    </div>
    <div class="footer">© Ulgen</div>
  </div>
</body>
</html>`;

  const text = [
    `Merhaba ${username || 'kullanıcı'},`,
    `Şifrenizi sıfırlamak için bağlantı:`,
    `${resetUrl}`,
    ``,
    `Bu bağlantı 10 dakika geçerlidir.`,
    `Bu talebi siz yapmadıysanız, bu e-postayı yok sayabilirsiniz.`,
  ].join('\n');

  return { html, text };
}

/* ------------ Public API ------------ */
async function sendEmailVerification(email, username, token) {
  const transporter = createTransporter();

  const clientUrl = resolveClientUrl();
  const backendBase = resolveBackendUrl();

  // Client varsa SPA route’una, yoksa backend GET endpoint’ine
  const verificationUrl = clientUrl
    ? joinUrl(clientUrl, `verify-email?token=${encodeURIComponent(token)}`)
    : joinUrl(backendBase, `api/auth/verify-email?token=${encodeURIComponent(token)}`);

  const logoUrl =
    process.env.EMAIL_LOGO_URL ||
    'https://via.placeholder.com/80x80/4a5568/ffffff?text=U&font-size=24';

  const { html, text } = verificationTemplate({ username, verificationUrl, logoUrl });

  const mailOptions = {
    from: buildFromHeader(),
    to: email,
    subject: 'Ulgen - E-posta Adresinizi Doğrulayın',
    html,
    text,
    headers: buildHeaders(),
    replyTo: process.env.EMAIL_REPLY_TO || undefined,
  };

  const info = await transporter.sendMail(mailOptions);
  if (info && info.message) {
    console.log(`Email verification (stream) to ${email}:\n${info.message.toString()}`);
  } else {
    console.log(`Email verification sent to ${email}`);
  }
}

async function sendPasswordReset(email, username, token) {
  const transporter = createTransporter();

  // Reset akışını her zaman frontend’e yönlendir
  const clientUrl = resolveClientUrl() || 'http://localhost:5173';
  const resetUrl = joinUrl(clientUrl, `reset-password?token=${encodeURIComponent(token)}`);

  const logoUrl =
    process.env.EMAIL_LOGO_URL ||
    'https://via.placeholder.com/80x80/4a5568/ffffff?text=U&font-size=24';

  const { html, text } = resetTemplate({ username, resetUrl, logoUrl });

  const mailOptions = {
    from: buildFromHeader(),
    to: email,
    subject: 'Ulgen - Şifre Sıfırlama',
    html,
    text,
    headers: buildHeaders(),
    replyTo: process.env.EMAIL_REPLY_TO || undefined,
  };

  const info = await transporter.sendMail(mailOptions);
  if (info && info.message) {
    console.log(`Password reset email (stream) to ${email}:\n${info.message.toString()}`);
  } else {
    console.log(`Password reset email sent to ${email}`);
  }
}

module.exports = {
  sendEmailVerification,
  sendPasswordReset,
};
