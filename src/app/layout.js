'use client';

import { SessionProvider } from 'next-auth/react';
import Header from '/components/Header';
import Footer from '/components/Footer';
import '/styles/global.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <SessionProvider>
          <div className="wrapper">
            <Header />
            <main className="content">
              {children}
            </main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
