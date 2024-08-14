import db from '/lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { slug } = req.query;
    try {
      const result = await db.query('SELECT COUNT(*) FROM activities WHERE slug = $1', [slug]);
      const exists = result.rows[0].count > 0;
      res.status(200).json({ exists });
    } catch (error) {
      console.error('Errore durante la verifica dello slug:', error);
      res.status(500).json({ success: false, error: 'Errore del server' });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}