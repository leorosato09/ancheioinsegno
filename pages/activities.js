import { useState } from 'react';
import Link from 'next/link'; // Import the Link component from Next.js
import db from '../lib/db'; // Ensure this points correctly to your PostgreSQL connection

export default function Activities({ activitiesData }) {
  const [filteredActivities, setFilteredActivities] = useState(activitiesData);
  const [selectedTags, setSelectedTags] = useState([]);

  const availableTags = ["cittadinanza", "sostenibilità", "costituzione"];

  const handleTagChange = (tag) => {
    setSelectedTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  const filterActivities = () => {
    if (selectedTags.length === 0) {
      setFilteredActivities(activitiesData);
    } else {
      setFilteredActivities(
        activitiesData.filter(activity =>
          selectedTags.some(tag => activity.tags.includes(tag))
        )
      );
    }
  };

  return (
    <div>
      <h1>Attività Formative</h1>
      <div>
        <label>Filtra per tag:</label>
        <div>
          {availableTags.map(tag => (
            <div key={tag}>
              <input
                type="checkbox"
                id={tag}
                value={tag}
                checked={selectedTags.includes(tag)}
                onChange={() => handleTagChange(tag)}
              />
              <label htmlFor={tag}>{tag.charAt(0).toUpperCase() + tag.slice(1)}</label>
            </div>
          ))}
        </div>
        <button onClick={filterActivities}>Applica filtro</button>
      </div>
      <ul>
        {filteredActivities.length > 0 ? (
          filteredActivities.map(activity => (
            <li key={activity.id}>
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
              <small>Durata complessiva: {activity.total_duration} minuti</small>
              <p>Tag: {activity.tags.join(', ')}</p>
              <h4>Sezioni:</h4>
              <ul>
                {activity.sections.map((section, index) => (
                  <li key={index}>
                    <strong>{section.title}</strong>
                    <p>{section.description}</p>
                    <p>Durata: {section.duration} minuti</p>
                  </li>
                ))}
              </ul>
              {/* Add a link to the activity's page */}
              <Link href={`/activities/${activity.slug}`}>
                Vai alla pagina dell&apos;attività
              </Link>
            </li>
          ))
        ) : (
          <p>Nessuna attività trovata</p>
        )}
      </ul>
    </div>
  );
}

// Esegui la query lato server
export async function getServerSideProps() {
  const result = await db.query(`
    SELECT activities.id, activities.title, activities.description, activities.total_duration, activities.slug, array_agg(tags.tag_name) AS tags, 
    json_agg(json_build_object('title', sections.title, 'description', sections.description, 'duration', sections.duration)) AS sections
    FROM activities
    LEFT JOIN activity_tags ON activities.id = activity_tags.activity_id
    LEFT JOIN tags ON activity_tags.tag_id = tags.id
    LEFT JOIN sections ON activities.id = sections.activity_id
    GROUP BY activities.id
  `);

  return {
    props: {
      activitiesData: result.rows
    }
  };
}