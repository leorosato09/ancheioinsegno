import db from '../../../lib/db'; // Assicurati che questo modulo gestisca la connessione a PostgreSQL

export default async function handler(req, res) {
  const { token } = req.query;

  try {
    // Trova l'utente nel database PostgreSQL in base al token di verifica
    const { rows } = await db.query(
      'SELECT id FROM users WHERE verification_token = $1',
      [token]
    );

    const user = rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Token non valido o scaduto' });
    }

    // Aggiorna lo stato dell'utente per indicare che l'email è stata verificata
    await db.query(
      'UPDATE users SET email_verified = true, verification_token = NULL WHERE id = $1',
      [user.id]
    );

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Errore durante la verifica dell\'email' });
  }
}