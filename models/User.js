CREATE TABLE users (
  id SERIAL PRIMARY KEY,  -- Identificatore univoco dell'utente
  email VARCHAR(255) UNIQUE NOT NULL,  -- Email univoca e obbligatoria
  password VARCHAR(255) NOT NULL,  -- Password crittografata
  role VARCHAR(50) DEFAULT 'insegnante',  -- Ruolo dell'utente con un valore predefinito
  email_verified BOOLEAN DEFAULT FALSE,  -- Stato della verifica email con valore predefinito
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Data di creazione
);