import db from '/lib/db';

export async function getStaticPaths() {
  const result = await db.query('SELECT slug FROM activities');
  const paths = result.rows.map(activity => ({
    params: { slug: activity.slug },
  }));

  return {
    paths,
    fallback: 'blocking', // Utilizza 'blocking' per generare nuove pagine al volo
  };
}

export async function getStaticProps({ params }) {
  const { slug } = params;

  // Recupera i dettagli dell'attività dal database in base allo slug
  const result = await db.query('SELECT * FROM activities WHERE slug = $1', [slug]);

  if (result.rows.length === 0) {
    return {
      notFound: true,
    };
  }

  const activity = result.rows[0];

  // Converti tutti i campi di tipo Date in stringhe
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
    revalidate: 1, // Rigenera la pagina ogni secondo per aggiornare i dati
  };
}

export default function ActivityPage({ activity }) {
  if (!activity) {
    return <div>Loading...</div>;
  }

  // Verifica che le proprietà siano definite e che siano array
  const keyCompetencies = activity.keyCompetencies || [];
  const manifestoPrinciples = activity.manifestoPrinciples || [];
  const tags = activity.tags || [];
  const sections = activity.sections || [];

  return (
    <div>
      <h1>{activity.title}</h1>
      <p><strong>Ordine e grado:</strong> {activity.order_grade}</p>
      <p><strong>Argomento:</strong> {activity.topic}</p>
      <p><strong>Materia:</strong> {activity.subject}</p>
      <p><strong>Competenze chiave:</strong> {keyCompetencies.join(', ')}</p>
      <p><strong>Principi del manifesto:</strong> {manifestoPrinciples.join(', ')}</p>
      <p><strong>Descrizione:</strong> {activity.description}</p>
      <p><strong>Durata complessiva:</strong> {activity.totalDuration} minuti</p>
      <p><strong>Tag:</strong> {tags.join(', ')}</p>

      <h2>Sezioni dell'attività</h2>
      {sections.map((section, index) => (
        <div key={index}>
          <h3>Sezione {index + 1}: {section.title}</h3>
          <p><strong>Descrizione:</strong> {section.description}</p>
          <p><strong>Durata:</strong> {section.duration} minuti</p>
        </div>
      ))}
    </div>
  );
}