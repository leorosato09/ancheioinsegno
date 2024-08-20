import { useState } from 'react';
import { useRouter } from 'next/router';
import db from '/lib/db';

export async function getServerSideProps() {
  const orderGradesRes = await db.query('SELECT name FROM order_grades');
  const topicsRes = await db.query('SELECT name FROM topics');
  const subjectsRes = await db.query('SELECT name FROM subjects');
  const keyCompetenciesRes = await db.query('SELECT name FROM key_competencies');
  const manifestoPrinciplesRes = await db.query('SELECT name FROM manifesto_principles');

  return {
    props: {
      availableOrderGrades: orderGradesRes.rows.map(row => row.name),
      availableTopics: topicsRes.rows.map(row => row.name),
      availableSubjects: subjectsRes.rows.map(row => row.name),
      availableKeyCompetencies: keyCompetenciesRes.rows.map(row => row.name),
      availableManifestoPrinciples: manifestoPrinciplesRes.rows.map(row => row.name),
    },
  };
}

export default function AddActivity({
  availableOrderGrades,
  availableTopics,
  availableSubjects,
  availableKeyCompetencies,
  availableManifestoPrinciples,
}) {
  const [title, setTitle] = useState('');
  const [orderGrade, setOrderGrade] = useState('');
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [subject, setSubject] = useState('');
  const [keyCompetencies, setKeyCompetencies] = useState([]);
  const [manifestoPrinciples, setManifestoPrinciples] = useState([]);
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState([{ title: '', description: '', duration: '' }]);
  const [totalDuration, setTotalDuration] = useState('');
  const [tags, setTags] = useState(''); 
  const router = useRouter();

  const generateSlug = async (title) => {
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$|^#|#$)/g, '');
  
    let exists = true;
    let suffix = 1;
  
    while (exists) {
      const response = await fetch(`/api/activities/check-slug?slug=${slug}`);
      const data = await response.json();
      if (!data.exists) {
        exists = false;
      } else {
        slug = `${slug}-${suffix}`;
        suffix += 1;
      }
    }

    return slug;
  };

  const handleCheckboxChange = (value, setState, currentState) => {
    setState(
      currentState.includes(value)
        ? currentState.filter(item => item !== value)
        : [...currentState, value]
    );
  };

  const handleSectionChange = (index, field, value) => {
    const updatedSections = sections.map((section, i) =>
      i === index ? { ...section, [field]: value } : section
    );
    setSections(updatedSections);
  };

  const addSection = () => {
    if (sections.length < 10) {
      setSections([...sections, { title: '', description: '', duration: '' }]);
    }
  };

  const removeSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orderGrade || selectedTopics.length === 0 || !subject || keyCompetencies.length === 0 || manifestoPrinciples.length === 0 || !totalDuration) {
      alert('Per favore, compila tutti i campi richiesti.');
      return;
    }

    const slug = await generateSlug(title);
    console.log('Generato slug:', slug);

    const activity = {
      title,
      orderGrade,
      topics: selectedTopics,
      subject,
      keyCompetencies,
      manifestoPrinciples,
      description,
      sections,
      totalDuration: parseFloat(totalDuration) || 0,
      tags: tags.split(',').map(tag => tag.trim()),
      slug,
    };
    
    console.log("Dati JSON inviati:", JSON.stringify(activity));
  
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activity),
      });

      console.log(JSON.stringify(activity))
    
      const result = await response.json();
      console.log('Risultato API:', result);
    
      if (result.success) {
        alert('Attività inserita con successo!');
        // Resetta i campi del form
        setTitle('');
        setOrderGrade('');
        setSelectedTopics([]); // Resetta selectedTopics
        setSubject('');
        setKeyCompetencies([]);
        setManifestoPrinciples([]);
        setDescription('');
        setSections([{ title: '', description: '', duration: '' }]);
        setTotalDuration('');
        setTags('');
      } else {
        alert('Errore durante l\'inserimento dell\'attività.');
      }
    } catch (error) {
      console.error('Errore durante la chiamata API:', error);
      alert('Errore durante l\'inserimento dell\'attività.');
    }
  };

  return (
    <div>
      <h1>Inserisci una nuova attività formativa</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Titolo:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Ordine e grado:</label>
          <select value={orderGrade} onChange={(e) => setOrderGrade(e.target.value)} required>
            <option value="">Seleziona un&apos;opzione</option>
            {availableOrderGrades.map(order => (
              <option key={order} value={order}>
                {order}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Argomenti:</label>
          {availableTopics.map(topic => (
            <div key={topic}>
              <input
                type="checkbox"
                id={topic}
                value={topic}
                checked={selectedTopics.includes(topic)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedTopics([...selectedTopics, topic]);
                  } else {
                    setSelectedTopics(selectedTopics.filter(t => t !== topic));
                  }
                }}
              />
              <label htmlFor={topic}>{topic}</label>
            </div>
          ))}
        </div>

        <div>
          <label>Materia:</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} required>
            <option value="">Seleziona una materia</option>
            {availableSubjects.map(subject => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Competenze chiave:</label>
          <div>
            {availableKeyCompetencies.map(comp => (
              <div key={comp}>
                <input
                  type="checkbox"
                  id={comp}
                  value={comp}
                  checked={keyCompetencies.includes(comp)}
                  onChange={() => handleCheckboxChange(comp, setKeyCompetencies, keyCompetencies)}
                />
                <label htmlFor={comp}>{comp}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label>Principi del manifesto:</label>
          <div>
            {availableManifestoPrinciples.map(principle => (
              <div key={principle}>
                <input
                  type="checkbox"
                  id={principle}
                  value={principle}
                  checked={manifestoPrinciples.includes(principle)}
                  onChange={() => handleCheckboxChange(principle, setManifestoPrinciples, manifestoPrinciples)}
                />
                <label htmlFor={principle}>{principle}</label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label>Descrizione:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Durata complessiva (in minuti):</label>
          <input
            type="number"
            value={totalDuration}
            onChange={(e) => setTotalDuration(parseFloat(e.target.value))}
            required
          />
        </div>

        <div>
          <label>Tag (separati da virgola):</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div>
          <label>Sezioni dell&apos;attività:</label>
          {sections.map((section, index) => (
            <div key={index}>
              <div>
                <label>Titolo della sezione:</label>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Descrizione della sezione:</label>
                <textarea
                  value={section.description}
                  onChange={(e) => handleSectionChange(index, 'description', e.target.value)}
                  required
                />
              </div>
              <div>
                <label>Durata della sezione (in minuti):</label>
                <input
                  type="number"
                  value={section.duration}
                  onChange={(e) => handleSectionChange(index, 'duration', parseFloat(e.target.value))}
                  required
                />
              </div>
              {sections.length > 1 && (
                <button type="button" onClick={() => removeSection(index)}>Rimuovi sezione</button>
              )}
            </div>
          ))}
          {sections.length < 10 && (
            <button type="button" onClick={addSection}>Aggiungi sezione</button>
          )}
        </div>

        <button type="submit">Inserisci Attività</button>
      </form>
    </div>
  );
}