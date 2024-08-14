import nodemailer from 'nodemailer';
import crypto from 'crypto';
import db from '../../../lib/db'; // Connessione a PostgreSQL

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { email } = req.body;

  try {
    // Cerca l'utente nel database PostgreSQL
    const { rows } = await db.query('SELECT id FROM users WHERE email = $1', [email]);

    const user = rows[0];

    if (!user) {
      return res.status(422).json({ error: 'User not found' });
    }

    // Genera un token di reset della password
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordExpire = new Date(Date.now() + 3600000); // 1 ora

    // Salva il token e la scadenza nel database
    await db.query(
      'UPDATE users SET reset_password_token = $1, reset_password_expire = $2 WHERE id = $3',
      [resetToken, resetPasswordExpire, user.id]
    );

    // Configura il trasporto per l'email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Link per resettare la password
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // Invia l'email con il link di reset della password
    await transporter.sendMail({
      to: email,
      subject: 'Reset Your Password',
      html: `<p>Clicca sul seguente link per resettare la tua password: <a href="${resetLink}">Reset Password</a></p>`,
    });

    res.status(200).json({ success: true, message: 'Email inviata!' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Errore nel processo di reset della password' });
  }
}