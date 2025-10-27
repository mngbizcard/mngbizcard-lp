// /api/contact.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // 送信先と内容
    await resend.emails.send({
      from: 'MNG BizCard <no-reply@mngbizcard.com>', // 認証済みドメイン推奨
      to: process.env.MAIL_TO, // 管理者宛先（環境変数に設定）
      subject: `New Inquiry from ${name}`,
      html: `
        <div style="font-family: system-ui, sans-serif; padding: 16px;">
          <h2>New Inquiry from MNG BizCard Contact Form</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr/>
          <small>Sent via Resend API · ${new Date().toLocaleString()}</small>
        </div>
      `,
    });

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Resend Error:', error);
    return res.status(500).json({ message: 'Failed to send email', error });
  }
}
