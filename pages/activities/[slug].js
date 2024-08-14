import db from '../../lib/db';

export async function getStaticPaths() {
  // Recupera tutti gli slug dal database
  const result = await db.query('SELECT slug FROM activities');
  const paths = result.rows.map((activity) => ({
    params: { slug: activity.slug },
  }));

  return {
    paths,
    fallback: false, // O true, se vuoi generare le pagine in modo incrementale
  };
}

export async function getStaticProps({ params }) {
  const result = await db.query('SELECT * FROM activities WHERE slug = $1', [params.slug]);
  const activity = result.rows[0];

  // Trasforma la data in stringa
  if (activity.created_at) {
    activity.created_at = activity.created_at.toISOString();
  }

  return { props: { activity } };
}

export default function ActivityPage({ activity }) {
  return (
    <div>
      <h1>{activity.title}</h1>
      <p>{activity.description}</p>
      <p>Durata: {activity.total_duration} minuti</p>
      <p>Creato il: {activity.created_at}</p>
    </div>
  );
}