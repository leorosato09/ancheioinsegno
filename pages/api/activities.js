import db from '/lib/db';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { title, orderGrade, topics, subject, keyCompetencies, manifestoPrinciples, description, sections, totalDuration, tags, slug } = req.body;

      await db.query(
        `INSERT INTO activities (title, order_grade, topics, subject, key_competencies, manifesto_principles, description, sections, total_duration, tags, slug)
         VALUES ($1, $2, $3::text[], $4, $5::text[], $6::text[], $7, $8::jsonb, $9, $10::text[], $11)`,
        [
          title,
          orderGrade,
          topics,
          subject,
          keyCompetencies,
          manifestoPrinciples,
          description,
          JSON.stringify(sections),
          totalDuration,
          tags,
          slug
        ]
      );      

      res.status(201).json({ success: true });
    } catch (error) {
      console.error('Errore durante l\'inserimento dell\'attività:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  } else if (req.method === 'GET' && req.query.slug) {
    const { slug } = req.query;
    try {
      const result = await db.query('SELECT COUNT(*) FROM activities WHERE slug = $1', [slug]);
      const exists = result.rows[0].count > 0;
      res.status(200).json({ exists });
    } catch (error) {
      console.error('Errore durante la verifica dello slug:', error);
      res.status(400).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ success: false, message: 'Method Not Allow' });
  }
}