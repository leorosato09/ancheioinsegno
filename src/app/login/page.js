'use client';  // Indica che questo file è un Client Component

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';  // Usa `next/navigation` invece di `next/router`
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
  
      if (result && result.error) {
        setError(result.error);
      } else if (result && result.url) {
        router.push('/profile');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (err) {
      console.error('Errore durante il login:', err);
      setError('Si è verificato un errore. Riprova più tardi.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
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
        <button type="submit">Login</button>
      </form>
      <Link href="/forgot-password/">
        Hai dimenticato la password?
      </Link>
    </div>
  );
}