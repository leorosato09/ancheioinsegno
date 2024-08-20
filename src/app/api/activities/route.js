import db from 'lib/db';

export async function GET() {
  const result = await db.query(`
    SELECT activities.id, activities.title, activities.description, activities.total_duration, activities.slug, array_agg(tags.tag_name) AS tags, 
    json_agg(json_build_object('title', sections.title, 'description', sections.description, 'duration', sections.duration)) AS sections
    FROM activities
    LEFT JOIN activity_tags ON activities.id = activity_tags.activity_id
    LEFT JOIN tags ON activity_tags.tag_id = tags.id
    LEFT JOIN sections ON activities.id = sections.activity_id
    GROUP BY activities.id
  `);

  return new Response(JSON.stringify(result.rows), {
    headers: { 'Content-Type': 'application/json' },
  });
}