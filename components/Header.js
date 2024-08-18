import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

const Header = () => {
  const { data: session } = useSession();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <header>
      <div className="header-logos">
        <img src="/images/Parole O_Stili | Logo.svg" alt="Parole O_Stili" />
        <img src="/images/AncheIoInsegno_Logo.svg" alt="#AncheIoInsegno" />
      </div>
      <div className="hamburger-menu" onClick={() => setNavOpen(true)}>
        <div></div>
        <div></div>
        <div></div>
      </div>

      {/* Menu a comparsa */}
      <div className={`nav-overlay ${navOpen ? 'open-nav' : ''}`}>
        <span className="closebtn" onClick={() => setNavOpen(false)}>&times;</span>
        <div className="nav-overlay-content">
          <Link href="/">Home</Link>
          <Link href="/activities">Attività Formative</Link>
          {session && session.user.role === 'admin' && (
            <Link href="/admin/add-activity">Aggiungi Attività</Link>
          )}
          {!session ? (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Registrati</Link>
            </>
          ) : (
            <>
              <Link href="/profile">Profilo</Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                style={logoutButtonStyle}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

const logoutButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#1e1068',
  cursor: 'pointer',
  textDecoration: 'underline',
  fontSize: '25px',
  display: 'block',
  padding: '8px',
  transition: '0.3s',
};

export default Header;