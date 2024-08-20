import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.error) {
        setMessage(result.error);
      } else {
        setMessage('Email inviata! Controlla la tua posta per il link di reset.');
      }
    } catch (error) {
      setMessage('Si è verificato un errore. Riprova più tardi.');
      console.error('Errore durante il recupero della password:', error);
    }
  };

  return (
    <div>
      <h1>Recupero Password</h1>
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
        {message && <p>{message}</p>}
        <button type="submit">Invia</button>
      </form>
    </div>
  );
}