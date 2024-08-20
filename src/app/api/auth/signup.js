import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Assicurati che questa variabile di ambiente sia impostata correttamente
  ssl: {
    rejectUnauthorized: false
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.log('Metodo non consentito'); // Aggiunto
    return res.status(405).end(); // Metodo non consentito
  }

  const { email, password } = req.body;
  console.log('Ricevuto richiesta di registrazione:', email); // Aggiunto

  try {
    // Verifica se l'utente esiste già nel database
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log('Verifica esistenza utente:', rows.length); // Aggiunto
    if (rows.length > 0) {
      console.log('Utente già esistente'); // Aggiunto
      return res.status(422).json({ error: 'User already exists' });
    }

    // Cripta la password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Password criptata:', hashedPassword); // Aggiunto

    // Genera un token di verifica univoco
    const token = crypto.randomBytes(32).toString('hex');
    console.log('Token generato:', token); // Aggiunto

    // Inserisci il nuovo utente nel database
    await pool.query(
      'INSERT INTO users (email, password, role, email_verified, verification_token) VALUES ($1, $2, $3, $4, $5)',
      [email, hashedPassword, 'insegnante', false, token]
    );
    console.log('Utente inserito nel database'); // Aggiunto

    // Configura il trasporto dell'email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    // Link di verifica
    const verificationLink = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
    console.log('Link di verifica generato:', verificationLink); // Aggiunto

    // Invia l'email di verifica
    await transporter.sendMail({
      to: email,
      subject: 'Verifica il tuo indirizzo email',
      html: `<p>Clicca sul seguente link per verificare il tuo indirizzo email: <a href="${verificationLink}">Verifica Email</a></p>`,
    });
    console.log('Email di verifica inviata'); // Aggiunto

    res.status(201).json({ success: true });
  } catch (error) {
    console.error('Errore durante la registrazione:', error); // Aggiunto
    res.status(500).json({ error: 'Errore durante la registrazione dell\'utente' });
  }
}