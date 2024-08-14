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
      activity: result.rows[0], // Passa i dati dell'attività come props alla pagina
    },
    revalidate: 1, // Rigenera la pagina ogni secondo per aggiornare i dati
  };
}

export default function ActivityPage({ activity }) {
  if (!activity) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{activity.title}</h1>
      <p>{activity.description}</p>
      {/* Visualizza gli altri dettagli dell'attività */}
    </div>
  );
}