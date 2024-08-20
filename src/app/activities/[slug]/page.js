'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaStar } from 'react-icons/fa';

export default function ActivityPage({ params }) {
  const [activity, setActivity] = useState(null);
  const [relatedActivities, setRelatedActivities] = useState([]);
  const [orderGrades, setOrderGrades] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [studentsCount, setStudentsCount] = useState('');
  const [orderGrade, setOrderGrade] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/activities/${params.slug}`);
        const data = await response.json();
        setActivity(data.activity);
        setRelatedActivities(data.relatedActivities);
        setOrderGrades(data.orderGrades);
      } catch (error) {
        console.error('Error fetching activity data:', error);
      }
    };

    fetchData();
  }, [params.slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const feedbackData = {
      activity_id: activity.id,
      students_count: studentsCount,
      order_grade: orderGrade,
      year: year,
      rating: rating,
    };

    try {
      const res = await fetch('/api/submit-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (res.ok) {
        alert('Feedback inviato con successo!');
        router.refresh(); // Ricarica la pagina
      } else {
        alert('Errore durante l\'invio del feedback.');
      }
    } catch (error) {
      alert('Si è verificato un errore durante l\'invio del feedback.');
    }
  };

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (!activity) {
    return <div>Loading...</div>;
  }

  const keyCompetencies = activity.keyCompetencies || [];
  const manifestoPrinciples = activity.manifestoPrinciples || [];
  const tags = activity.tags || [];
  const sections = activity.sections || [];
  const totalDuration = sections.reduce((total, section) => total + section.duration, 0);

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
            <div className="accordion-title-left" onClick={() => handleToggle(0)}>
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
            <div className="accordion-title-left" onClick={() => handleToggle(1)}>
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
            <div className="accordion-title-left" onClick={() => handleToggle(2)}>
              Competenze Chiave
              <span className="arrow">{activeIndex === 2 ? '▲' : '▼'}</span>
            </div>
            {activeIndex === 2 && (
              <div className="accordion-content">
                <p>{activity.key_competencies.join(', ')}</p>
              </div>
            )}
          </div>

          <div className={`accordion-item ${activeIndex === 3 ? 'active' : ''}`}>
            <div className="accordion-title-left" onClick={() => handleToggle(3)}>
              Principi del Manifesto
              <span className="arrow">{activeIndex === 3 ? '▲' : '▼'}</span>
            </div>
            {activeIndex === 3 && (
              <div className="accordion-content">
                <p>{activity.manifesto_principles.join(', ')}</p>
              </div>
            )}
          </div>
        </div>

        <div className="container-svolgimento">
          <div className="header">
            <h2 className="sectionsTitle">SVOLGIMENTO</h2>
            <div className="total-duration">
              <img className="clock" src="/images/clock.svg" alt="Orologio" />
              <span>{totalDuration} &apos;</span>
            </div>
          </div>
          {sections.map((section, index) => (
            <div key={index} className={`accordion-svolgimento ${activeIndex === index + 4 ? 'active' : ''}`}>
              <div className="accordion-title-svolgimento" onClick={() => handleToggle(index + 4)}>
                <span>{section.title}</span>
                <div className="arrow-duration">
                  <img src={`/images/accordion.svg`} alt="Freccia"
                    className={`arrow ${activeIndex === index + 4 ? 'open' : 'closed'}`} />
                  <div className="duration-indicator">
                    <span>{section.duration} &apos;</span>
                  </div>
                </div>
              </div>
              {activeIndex === index + 4 && (
                <div className="accordion-content">
                  <p className="sectionDetail">{section.description}</p>
                </div>
              )}
            </div>
          ))}

          <div className="container-feedback">
            <form onSubmit={handleSubmit} className="feedback-form">
              <h3 className="form-title">
                Hai completato l&apos;attività? Inviaci la tua valutazione, entra ufficialmente nella community!
              </h3>
              <div className="container-form">
                <h3 style={{ fontSize: '15px', color: '#1d0f67' }}>
                  La tua opinione è importante, ci permette di rafforzare la community di #paroleostili e migliorare l’esperienza didattica.
                  Compila il form ogni volta che hai completato l’attività con una delle tue classi. Grazie ❤️
                </h3>
                <label>
                  Quanti studenti hanno svolto l&apos;attività?
                  <input
                    type="number"
                    value={studentsCount}
                    onChange={(e) => setStudentsCount(e.target.value)}
                    required
                  />
                </label>

                <label>
                  Quale ordine e grado frequenta la classe?
                  <select value={orderGrade} onChange={(e) => setOrderGrade(e.target.value)} required>
                    <option value="">Seleziona</option>
                    <option value="infanzia">Infanzia</option>
                    <option value="primaria">Primaria</option>
                    <option value="secondariaIgrado">Secondaria I Grado</option>
                    <option value="secondariaIIgrado">Secondaria II Grado</option>
                  </select>
                </label>

                <label>
                  Che anno frequentano?
                  <select value={year} onChange={(e) => setYear(e.target.value)} required>
                    <option value="">Seleziona</option>
                    <option value="I">I</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                    <option value="V">V</option>
                  </select>
                </label>

                <div className="rating">
                  <label>Valuta l&apos;attività</label>
                  <div className="stars">
                    {[...Array(5)].map((star, index) => {
                      const ratingValue = index + 1;
                      return (
                        <label key={index}>
                          <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => setRating(ratingValue)}
                            style={{ display: 'none' }}
                          />
                          <FaStar
                            className="star"
                            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                            size={30}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(null)}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button type="submit">Invia</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="related-activities">
        <h3>Attività Correlate</h3>
        {relatedActivities.length > 0 ? (
          <ul>
            {relatedActivities.map((relatedActivity) => (
              <li key={relatedActivity.id} className="related-activity-item">
                <a href={`/activities/${relatedActivity.slug}`}>
                  <h4>{relatedActivity.title}</h4>
                  <p>{relatedActivity.order_grade}</p>
                  <p>{relatedActivity.topics.join(', ')}</p>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>Non ci sono attività correlate disponibili.</p>
        )}
      </div>

    </div>
  );
}