const nodemailer = require('nodemailer');

// Create transporter (using Gmail for development)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send email verification
const sendEmailVerification = async (email, username, token) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${encodeURIComponent(token)}`;
    const logoUrl = process.env.EMAIL_LOGO_URL || 'https://via.placeholder.com/80x80/4a5568/ffffff?text=U&font-size=24';
    
    const mailOptions = {
      from: `"Ulgen" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Ulgen - E-posta Adresinizi Doğrulayın',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>E-posta Doğrulama</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #e2e8f0; background: #0f172a; margin: 0; padding: 24px; }
            .outer { max-width: 640px; margin: 0 auto; background: linear-gradient(180deg,#0f172a,#111827); border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,.4); }
            .header { text-align: center; padding: 28px 24px; background: radial-gradient(1200px 1200px at 50% -200px, rgba(59,130,246,.25), transparent 60%); }
            .logo { width: 72px; height: 72px; border-radius: 50%; border: 3px solid #374151; display: inline-block; }
            h1 { color: #f3f4f6; margin: 12px 0 6px; font-size: 24px; }
            .subtitle { color: #9ca3af; font-size: 14px; }
            .container { padding: 32px 28px; }
            .card { background: rgba(31,41,55,.6); border: 1px solid #374151; border-radius: 14px; padding: 24px; }
            .content { color: #d1d5db; }
            .button { display: inline-block; background: linear-gradient(90deg,#2563eb,#1d4ed8); color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; letter-spacing: .2px; box-shadow: 0 8px 20px rgba(37,99,235,.35); border: 2px solid #1d4ed8; }
            .button:hover { background: linear-gradient(90deg,#1d4ed8,#1e40af); }
            .muted { color: #9ca3af; font-size: 12px; }
            .code { word-break: break-all; background-color: #0b1220; color: #cbd5e1; padding: 12px; border-radius: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; border: 1px solid #1f2937; }
            .footer { text-align: center; padding: 20px; border-top: 1px solid #1f2937; color: #6b7280; font-size: 12px; }
            .warning { background: rgba(239,68,68,.15); color: #fecaca; padding: 12px; border-radius: 10px; border: 1px solid rgba(239,68,68,.35); }
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
                <p>Merhaba <strong>${username}</strong>,</p>
                <p>Ulgen ailesine katıldığınız için teşekkür ederiz! Hesabınızı aktifleştirmek için aşağıdaki butona tıklayarak e‑posta adresinizi doğrulayın.</p>
                <div style="text-align:center; margin: 22px 0 18px;">
                  <a href="${verificationUrl}" class="button" style="display:inline-block;background:linear-gradient(90deg,#2563eb,#1d4ed8);color:#ffffff !important;padding:14px 28px;text-decoration:none;border-radius:10px;font-weight:700;letter-spacing:.2px;box-shadow:0 8px 20px rgba(37,99,235,.35);border:2px solid #1d4ed8;">E‑postamı Doğrula</a>
                </div>
                <p class="muted">Eğer buton çalışmıyorsa, aşağıdaki linki kopyalayıp tarayıcınıza yapıştırabilirsiniz:</p>
                <p class="code">${verificationUrl}</p>
                <div class="warning">Bu doğrulama bağlantısı <strong>7 gün</strong> geçerlidir. Süre dolduğunda yeni bir doğrulama e‑postası talep etmeniz gerekir.</div>
              </div>
            </div>
            <div class="footer">Bu e‑postayı siz talep etmediyseniz, lütfen dikkate almayın. • © 2024 Ulgen</div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email verification sent to ${email}`);
  } catch (error) {
    console.error('Error sending email verification:', error);
    throw error;
  }
};

// Send password reset email
const sendPasswordReset = async (email, username, token) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${encodeURIComponent(token)}`;
    const logoUrl = process.env.EMAIL_LOGO_URL || 'https://via.placeholder.com/80x80/4a5568/ffffff?text=U&font-size=24';
    
    const mailOptions = {
      from: `"Ulgen" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Ulgen - Şifre Sıfırlama',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Şifre Sıfırlama</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #e2e8f0; background: #0f172a; margin: 0; padding: 24px; }
            .outer { max-width: 640px; margin: 0 auto; background: linear-gradient(180deg,#0f172a,#111827); border: 1px solid #1f2937; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,.4); }
            .header { text-align: center; padding: 28px 24px; background: radial-gradient(1200px 1200px at 50% -200px, rgba(239,68,68,.22), transparent 60%); }
            .logo { width: 72px; height: 72px; border-radius: 50%; border: 3px solid #374151; display: inline-block; }
            h1 { color: #f3f4f6; margin: 12px 0 6px; font-size: 24px; }
            .subtitle { color: #9ca3af; font-size: 14px; }
            .container { padding: 32px 28px; }
            .card { background: rgba(31,41,55,.6); border: 1px solid #374151; border-radius: 14px; padding: 24px; }
            .content { color: #d1d5db; }
            .button { display: inline-block; background: linear-gradient(90deg,#2563eb,#1d4ed8); color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: 700; letter-spacing: .2px; box-shadow: 0 8px 20px rgba(37,99,235,.35); }
            .button:hover { background: linear-gradient(90deg,#1d4ed8,#1e40af); }
            .muted { color: #9ca3af; font-size: 12px; }
            .code { word-break: break-all; background-color: #0b1220; color: #cbd5e1; padding: 12px; border-radius: 8px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; border: 1px solid #1f2937; }
            .footer { text-align: center; padding: 20px; border-top: 1px solid #1f2937; color: #6b7280; font-size: 12px; }
            .warning { background: rgba(239,68,68,.15); color: #fecaca; padding: 12px; border-radius: 10px; border: 1px solid rgba(239,68,68,.35); }
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
                <p>Merhaba <strong>${username}</strong>,</p>
                <p>Hesabınız için şifre sıfırlama talebinde bulundunuz. Yeni şifre oluşturmak için aşağıdaki butona tıklayın.</p>
                <div style="text-align:center; margin: 22px 0 18px;">
                  <a href="${resetUrl}" class="button" style="display:inline-block;background:linear-gradient(90deg,#2563eb,#1d4ed8);color:#ffffff !important;padding:14px 28px;text-decoration:none;border-radius:10px;font-weight:700;letter-spacing:.2px;box-shadow:0 8px 20px rgba(37,99,235,.35);border:2px solid #1d4ed8;">Şifremi Sıfırla</a>
                </div>
                <p class="muted">Eğer buton çalışmıyorsa, aşağıdaki linki kopyalayıp tarayıcınıza yapıştırabilirsiniz:</p>
                <p class="code">${resetUrl}</p>
                <div class="warning">Bu bağlantı <strong>10 dakika</strong> geçerlidir. Süre dolduğunda yeni bir talepte bulunmanız gerekir.</div>
                <p class="muted">Bu talebi siz yapmadıysanız, lütfen bu e‑postayı dikkate almayın.</p>
              </div>
            </div>
            <div class="footer">© 2024 Ulgen</div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

module.exports = {
  sendEmailVerification,
  sendPasswordReset
};

