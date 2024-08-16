import db from '/lib/db';

export async function getStaticPaths() {
  const result = await db.query('SELECT slug FROM activities');
  const paths = result.rows.map(activity => ({
    params: { slug: activity.slug },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  const result = await db.query('SELECT * FROM activities WHERE slug = $1', [slug]);

  if (result.rows.length === 0) {
    return {
      notFound: true,
    };
  }

  const activity = result.rows[0];

  if (activity.created_at) {
    activity.created_at = activity.created_at.toISOString();
  }
  if (activity.updated_at) {
    activity.updated_at = activity.updated_at.toISOString();
  }

  return {
    props: {
      activity,
    },
    revalidate: 1,
  };
}

export default function ActivityPage({ activity }) {
  if (!activity) {
    return <div>Loading...</div>;
  }

  const keyCompetencies = activity.keyCompetencies || [];
  const manifestoPrinciples = activity.manifestoPrinciples || [];
  const tags = activity.tags || [];
  const sections = activity.sections || [];

  return (
    <div className="container">
      <h1 className="title">{activity.title}</h1>
      <p className="detail"><strong>Ordine e grado:</strong> {activity.order_grade}</p>
      <p className="detail"><strong>Argomento:</strong> {activity.topic}</p>
      <p className="detail"><strong>Materia:</strong> {activity.subject}</p>
      <p className="detail"><strong>Competenze chiave:</strong> {keyCompetencies.join(', ')}</p>
      <p className="detail"><strong>Principi del manifesto:</strong> {manifestoPrinciples.join(', ')}</p>
      <p className="description"><strong>Descrizione:</strong> {activity.description}</p>
      <p className="tags"><strong>Tag:</strong> {tags.join(', ')}</p>

      <h2 className="sectionsTitle">Sezioni dell&apos;attività</h2>
      {sections.map((section, index) => (
        <div key={index} className="section">
          <h3 className="sectionTitle">Sezione {index + 1}: {section.title}</h3>
          <p className="sectionDetail"><strong>Descrizione:</strong> {section.description}</p>
          <p className="sectionDetail"><strong>Durata:</strong> {section.duration} minuti</p>
        </div>
      ))}
    </div>
  );
}