'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Activities() {
  const [activitiesData, setActivitiesData] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const availableTags = ["cittadinanza", "sostenibilità", "costituzione"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/activities');
        const data = await response.json();
        setActivitiesData(data);
        setFilteredActivities(data);
      } catch (error) {
        console.error('Errore durante il fetch dei dati:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredActivities(activitiesData);
    } else {
      setFilteredActivities(
        activitiesData.filter(activity =>
          selectedTags.some(tag => activity.tags.includes(tag))
        )
      );
    }
  }, [selectedTags, activitiesData]);

  const handleTagChange = (tag) => {
    setSelectedTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
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