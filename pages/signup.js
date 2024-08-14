import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    console.log('Form submitted');
    console.log('Email:', email);
    console.log('Password:', password);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);

      const result = await response.json();

      console.log('Result from API:', result);

      if (result.error) {
        console.log('Error from API:', result.error);
        setError(result.error);
      } else {
        console.log('Signup successful');
        setSuccess('Registrazione avvenuta con successo! Controlla la tua email per verificare il tuo account.');
        // Se desideri, puoi reindirizzare l'utente alla pagina di login
        // router.push('/login');
      }
    } catch (err) {
      console.error('Errore durante la registrazione:', err);
      setError('Si è verificato un errore durante la registrazione. Riprova più tardi.');
    }
  };

  return (
    <div>
      <h1>Registrati</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        <button type="submit">Registrati</button>
      </form>
    </div>
  );
}