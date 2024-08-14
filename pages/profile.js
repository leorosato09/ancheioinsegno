import { getSession } from 'next-auth/react';
import db from '../lib/db';

export default function Profile({ userData }) {
  if (!userData) {
    return <p>Errore nel caricamento dei dati utente</p>;
  }

  return (
    <div>
      <h1>Il tuo profilo</h1>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Tipologia di utente:</strong> {userData.role}</p>
      <p><strong>Data di creazione dell&apos;account:</strong> {new Date(userData.created_at).toLocaleDateString()}</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const result = await db.query('SELECT email, role, created_at FROM users WHERE email = $1', [session.user.email]);

  if (!result.rows.length) {
    return {
      notFound: true,
    };
  }

  const userData = result.rows[0];
  userData.created_at = userData.created_at.toISOString(); // Convert the Date object to a string

  return {
    props: {
      userData,
    },
  };
}