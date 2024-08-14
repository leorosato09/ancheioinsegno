import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import db from "../../../lib/db"; // Assicurati di avere un file db.js per la connessione a PostgreSQL

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Trova l'utente nel database PostgreSQL in base all'email
        const { rows } = await db.query(
          "SELECT id, email, password, role FROM users WHERE email = $1",
          [credentials.email]
        );

        const user = rows[0];

        if (!user) {
          throw new Error("No user found with this email");
        }

        // Confronta la password inserita con quella hashata nel database
        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Incorrect password");
        }

        // Se l'autenticazione ha successo, restituisci l'utente
        return { id: user.id, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Aggiungi il ruolo utente alla sessione
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      // Se l'utente è autenticato, aggiungi l'id e il ruolo al token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: '/login', // Pagina di login
    error: '/auth/error', // Pagina di errore in caso di problemi di autenticazione
  },
  secret: process.env.NEXTAUTH_SECRET, // Utilizza la chiave segreta dal file .env.local
  session: {
    jwt: true, // Usa JWT per le sessioni
  },
});