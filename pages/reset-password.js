import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const { token } = router.query;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      return setError('Le password non corrispondono');
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
      } else {
        setMessage('Password resettata con successo!');
        setTimeout(() => router.push('/login'), 2000); // Reindirizza dopo 2 secondi
      }
    } catch (error) {
      setError('Si è verificato un errore. Riprova più tardi.');
      console.error('Errore durante il reset della password:', error);
    }
  };

  return (
    <div>
      <h1>Resetta la tua Password</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nuova Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Conferma Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
        <button type="submit">Resetta Password</button>
      </form>
    </div>
  );
}