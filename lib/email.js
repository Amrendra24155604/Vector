const nodemailer = require('nodemailer');

// ─── Transporter ────────────────────────────────────────────────────────────
// Supports Gmail (EMAIL_SERVICE=gmail) or any SMTP provider.
// For Gmail: enable 2FA → generate an App Password → set EMAIL_PASS to that.
// For production: use Resend / SendGrid SMTP instead.
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'placeholder@gmail.com',
    pass: process.env.EMAIL_PASS || 'placeholder-app-password',
  },
});

// ─── Send OTP Email ──────────────────────────────────────────────────────────
async function sendOtpEmail(to, otp) {
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@kaareerpilot.com';

  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#09080a;font-family:'Inter',sans-serif;">
      <div style="max-width:480px;margin:40px auto;padding:40px 32px;background:#171522;border:1px solid rgba(251,146,60,0.15);border-radius:24px;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="display:inline-flex;align-items:center;gap:10px;">
            <span style="font-size:24px;font-weight:900;color:#fff;letter-spacing:-0.04em;">KareerPilot</span>
          </div>
        </div>
        <h2 style="color:#fff;font-size:20px;font-weight:700;margin:0 0 8px;text-align:center;">Verify your email</h2>
        <p style="color:#a8a29e;font-size:14px;text-align:center;margin:0 0 32px;line-height:1.6;">
          Enter this code to complete your registration. It expires in <strong style="color:#fdba74;">10 minutes</strong>.
        </p>
        <div style="background:#09080a;border:1px solid rgba(249,115,22,0.2);border-radius:16px;padding:24px;text-align:center;margin-bottom:32px;">
          <span style="font-size:42px;font-weight:900;letter-spacing:0.2em;color:#fb923c;font-family:monospace;">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:12px;text-align:center;margin:0;">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    </body>
    </html>
  `;

  await transporter.sendMail({
    from: `"KareerPilot" <${from}>`,
    to,
    subject: `${otp} — Your KareerPilot verification code`,
    html,
  });
}

module.exports = { sendOtpEmail };
