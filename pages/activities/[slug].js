import React, { useState } from 'react';
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
  const [activeIndex, setActiveIndex] = useState(null); // Aggiunta dello stato

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index); // Funzione per gestire l'espansione del menu
  };

  if (!activity) {
    return <div>Loading...</div>;
  }

  const keyCompetencies = activity.keyCompetencies || [];
  const manifestoPrinciples = activity.manifestoPrinciples || [];
  const tags = activity.tags || [];
  const sections = activity.sections || [];

  const getOrderGradeClass = (orderGrade) => {
    switch (orderGrade) {
      case 'Infanzia':
        return 'ordergrade-infanzia';
      case 'Primaria':
        return 'ordergrade-primaria';
      case 'Secondaria I Grado':
        return 'ordergrade-secondaria1';
      case 'Secondaria II Grado':
        return 'ordergrade-secondaria2';
      default:
        return '';
    }
  };

  return (
    <div className="container">
      <div className="container-title">
        <p className={`ordergrade ${getOrderGradeClass(activity.order_grade)}`}>
          {activity.order_grade}
        </p>
        <h1 className="title">{activity.title}</h1>
        <div className="topics">
          {activity.topics.map((topic, index) => (
            <p key={index} className="topic-item">
              {topic}
            </p>
          ))}
        </div>
      </div>
  
      <div className="container-colonne">
        <div className="container-tendina">
          <div className={`accordion-item ${activeIndex === 0 ? 'active' : ''}`}>
            <div className="accordion-title" onClick={() => handleToggle(0)}>
              Argomento
              <span className="arrow">{activeIndex === 0 ? '▲' : '▼'}</span>
            </div>
            {activeIndex === 0 && (
              <div className="accordion-content">
                <p>{activity.topics.join(', ')}</p>
              </div>
            )}
          </div>
  
          <div className={`accordion-item ${activeIndex === 1 ? 'active' : ''}`}>
            <div className="accordion-title" onClick={() => handleToggle(1)}>
              Materia
              <span className="arrow">{activeIndex === 1 ? '▲' : '▼'}</span>
            </div>
            {activeIndex === 1 && (
              <div className="accordion-content">
                <p>{activity.subject}</p>
              </div>
            )}
          </div>
  
          <div className={`accordion-item ${activeIndex === 2 ? 'active' : ''}`}>
            <div className="accordion-title" onClick={() => handleToggle(2)}>
              Competenze Chiave
              <span className="arrow">{activeIndex === 2 ? '▲' : '▼'}</span>
            </div>
            {activeIndex === 2 && (
              <div className="accordion-content">
                <p>{keyCompetencies.join(', ')}</p>
              </div>
            )}
          </div>
  
          <div className={`accordion-item ${activeIndex === 3 ? 'active' : ''}`}>
            <div className="accordion-title" onClick={() => handleToggle(3)}>
              Principi del Manifesto
              <span className="arrow">{activeIndex === 3 ? '▲' : '▼'}</span>
            </div>
            {activeIndex === 3 && (
              <div className="accordion-content">
                <p>{manifestoPrinciples.join(', ')}</p>
              </div>
            )}
          </div>
        </div>
  
        <div className="container-svolgimento">
          {/* Contenuto aggiuntivo per container-svolgimento */}
        </div>
      </div>
  
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