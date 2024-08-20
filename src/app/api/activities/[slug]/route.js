// src/app/api/activities/[slug]/route.js
import db from 'lib/db';

export async function GET(request, { params }) {
  const { slug } = params;

  const result = await db.query('SELECT * FROM activities WHERE slug = $1', [slug]);
  const gradesResult = await db.query('SELECT * FROM order_grades');

  if (result.rows.length === 0) {
    return new Response('Not Found', { status: 404 });
  }

  const activity = result.rows[0];

  const relatedActivitiesResult = await db.query(
    `SELECT * FROM activities 
     WHERE id != $1 AND 
           order_grade = $2 AND 
           (topics && $3::text[] OR key_competencies && $4::text[])
     LIMIT 5`,
    [activity.id, activity.order_grade, activity.topics, activity.key_competencies]
  );

  const relatedActivities = relatedActivitiesResult.rows;

  return new Response(JSON.stringify({
    activity,
    relatedActivities,
    orderGrades: gradesResult.rows,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}