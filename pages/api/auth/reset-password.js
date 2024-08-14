import bcrypt from 'bcryptjs';
import db from '../../../lib/db'; // Connessione a PostgreSQL

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { token, password } = req.body;

  try {
    // Trova l'utente nel database con il token valido e non scaduto
    const { rows } = await db.query(
      'SELECT id, reset_password_expire FROM users WHERE reset_password_token = $1 AND reset_password_expire > NOW()',
      [token]
    );

    const user = rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Token non valido o scaduto' });
    }

    // Aggiorna la password dell'utente
    const hashedPassword = await bcrypt.hash(password, 12);

    await db.query(
      'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expire = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );

    res.status(200).json({ success: true, message: 'Password resettata con successo' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Errore nel resettare la password' });
  }
}