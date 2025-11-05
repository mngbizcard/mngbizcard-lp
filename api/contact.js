// api/contact.js
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,  // Gmailアカウント
        pass: process.env.MAIL_PASS,  // アプリパスワード
      },
    });

    await transporter.sendMail({
      from: `"MNG BizCard 問い合わせ" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_TO || process.env.MAIL_USER,
      subject: `【MNG BizCard】お問い合わせ: ${name}`,
      text: `名前: ${name}\nメール: ${email}\n\nメッセージ:\n${message}`,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
}
