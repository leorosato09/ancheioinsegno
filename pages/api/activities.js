import db from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { title, orderGrade, topic, subject, keyCompetencies, manifestoPrinciples, description, sections, totalDuration, tags, slug } = req.body;

      // Verifica se lo slug esiste già
      const slugCheckResult = await db.query('SELECT COUNT(*) FROM activities WHERE slug = $1', [slug]);
      if (slugCheckResult.rows[0].count > 0) {
        return res.status(400).json({ success: false, error: 'duplicate key value violates unique constraint "unique_slug"' });
      }

      // Inserisci l'attività nel database
      await db.query(
        `INSERT INTO activities (title, order_grade, topic, subject, key_competencies, manifesto_principles, description, sections, total_duration, tags, slug)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [title, orderGrade, topic, subject, keyCompetencies, manifestoPrinciples, description, JSON.stringify(sections), totalDuration, tags, slug]
      );

      res.status(201).json({ success: true });
    } catch (error) {
      console.error('Errore durante l\'inserimento dell\'attività:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }
}