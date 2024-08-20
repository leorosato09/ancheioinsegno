import db from '/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { activity_id, students_count, order_grade, year, rating } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO feedback (activity_id, students_count, order_grade, year, rating) VALUES ($1, $2, $3, $4, $5)',
      [activity_id, students_count, order_grade, year, rating]
    );

    return res.status(200).json({ message: 'Feedback saved successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error saving feedback' });
  }
}