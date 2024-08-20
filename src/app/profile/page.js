'use client';  // Indica che questo componente è un Client Component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.status === 401) {
          router.push('/login');
        } else if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('Errore nel caricamento dei dati utente');
        }
      } catch (error) {
        console.error('Errore durante il fetch dei dati utente:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return <p>Caricamento...</p>;
  }

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