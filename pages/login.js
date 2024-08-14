import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import db from '../lib/db'; // Importa il modulo per la connessione a PostgreSQL
import bcrypt from 'bcryptjs'; // Per confrontare le password crittografate
import Link from 'next/link';

export default function Login({ initialError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(initialError || '');
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

export async function getServerSideProps(context) {
  const { email, password } = context.query;

  if (!email || !password) {
    return {
      props: {
        initialError: '',
      },
    };
  }

  try {
    // Esegui la query per verificare le credenziali
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return {
        props: {
          initialError: 'Credenziali non valide',
        },
      };
    } else {
      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return {
          props: {
            initialError: 'Credenziali non valide',
          },
        };
      }

      // L'utente è valido, puoi passare altri dati se necessario
      return {
        props: {
          initialError: '',
        },
      };
    }
  } catch (err) {
    console.error('Errore durante la verifica delle credenziali:', err);
    return {
      props: {
        initialError: 'Si è verificato un errore. Riprova più tardi.',
      },
    };
  }
}